import { createPrivateKey, createSign } from "node:crypto";
import { contentPaths, type ContentKind } from "@/lib/admin-content";

const DEFAULT_REPOSITORY = "melvingb/nextgen-site";

type InstallationToken = {
  token: string;
  expiresAt: number;
};

type GitHubFile = {
  sha: string;
  content: string;
};

let cachedInstallationToken: InstallationToken | null = null;

function base64url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function getRepository() {
  return (process.env.GITHUB_CONTENT_REPOSITORY || DEFAULT_REPOSITORY).trim();
}

export function getPublishingBranch() {
  const configured = process.env.GITHUB_CONTENT_BRANCH?.trim();
  if (configured) return configured;
  return process.env.VERCEL_ENV === "preview" ? "feat/admin-auth" : "main";
}

function normalizePem(raw: string) {
  let value = raw
    .replace(/^\uFEFF/, "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }

  return value;
}

function getPrivateKey() {
  const configuredBase64 = process.env.GITHUB_APP_PRIVATE_KEY_BASE64?.trim();
  const configuredPem = process.env.GITHUB_APP_PRIVATE_KEY?.trim();

  if (!configuredBase64 && !configuredPem) {
    throw new Error(
      "GitHub App private key is not configured. Set GITHUB_APP_PRIVATE_KEY_BASE64 (recommended) or GITHUB_APP_PRIVATE_KEY."
    );
  }

  let raw = "";

  if (configuredBase64) {
    // Be forgiving if the full PEM was pasted into the BASE64 variable by mistake.
    raw = configuredBase64.includes("-----BEGIN")
      ? configuredBase64
      : Buffer.from(configuredBase64.replace(/\s+/g, ""), "base64").toString("utf8");
  } else {
    raw = configuredPem ?? "";
  }

  raw = normalizePem(raw);

  if (!raw.includes("-----BEGIN") || !raw.includes("PRIVATE KEY-----")) {
    throw new Error(
      "GitHub App private key value is invalid. GITHUB_APP_PRIVATE_KEY_BASE64 must be the base64 of the downloaded .pem file, not the SHA256 fingerprint, Client Secret, App ID, or Installation ID."
    );
  }

  try {
    return createPrivateKey({ key: raw, format: "pem" });
  } catch {
    throw new Error(
      "GitHub App private key contains PEM markers but Node could not decode it. Generate a fresh GitHub App private key and encode that .pem file as base64."
    );
  }
}

function createAppJwt() {
  const appId = process.env.GITHUB_APP_ID?.trim();
  if (!appId) throw new Error("GITHUB_APP_ID is not configured.");

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iat: now - 60,
      exp: now + 9 * 60,
      iss: appId,
    })
  );

  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(getPrivateKey()).toString("base64url");

  return `${unsigned}.${signature}`;
}

async function getInstallationToken() {
  if (
    cachedInstallationToken &&
    cachedInstallationToken.expiresAt > Date.now() + 5 * 60 * 1000
  ) {
    return cachedInstallationToken.token;
  }

  const installationId = process.env.GITHUB_APP_INSTALLATION_ID?.trim();
  if (!installationId) {
    throw new Error("GITHUB_APP_INSTALLATION_ID is not configured.");
  }

  const response = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${createAppJwt()}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "nextgen-site-admin",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const body = await response.text();
    console.error("[nextgen-admin] installation token failed", response.status, body);
    throw new Error(`GitHub App token request failed (${response.status}).`);
  }

  const data = (await response.json()) as {
    token: string;
    expires_at: string;
  };

  cachedInstallationToken = {
    token: data.token,
    expiresAt: new Date(data.expires_at).getTime(),
  };

  return data.token;
}

async function github(path: string, init: RequestInit = {}) {
  const token = await getInstallationToken();
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "nextgen-site-admin",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  return response;
}

function contentUrl(path: string) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `/repos/${getRepository()}/contents/${encodedPath}`;
}

export async function getRepositoryFile(path: string): Promise<GitHubFile | null> {
  const response = await github(
    `${contentUrl(path)}?ref=${encodeURIComponent(getPublishingBranch())}`
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Could not read ${path} from GitHub (${response.status}).`);
  }

  const data = (await response.json()) as {
    sha: string;
    content?: string;
    encoding?: string;
  };

  if (!data.content || data.encoding !== "base64") {
    throw new Error(`GitHub did not return file content for ${path}.`);
  }

  return {
    sha: data.sha,
    content: Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8"),
  };
}

export async function writeRepositoryFile(
  path: string,
  content: string,
  message: string
) {
  const current = await getRepositoryFile(path);
  const branch = getPublishingBranch();

  if (current?.content === content) {
    return {
      changed: false,
      sha: "",
      url: "",
      path,
      branch,
    };
  }

  const body: Record<string, string> = {
    message,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch,
  };
  if (current?.sha) body.sha = current.sha;

  const response = await github(contentUrl(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[nextgen-admin] write failed", response.status, detail);
    throw new Error(`GitHub rejected the publish request (${response.status}).`);
  }

  const data = (await response.json()) as {
    commit?: { sha?: string; html_url?: string };
    content?: { path?: string };
  };

  return {
    changed: true,
    sha: data.commit?.sha ?? "",
    url: data.commit?.html_url ?? "",
    path: data.content?.path ?? path,
    branch,
  };
}

export async function writeRepositoryBinary(
  path: string,
  bytes: Uint8Array,
  message: string
) {
  const current = await getRepositoryFile(path);
  const body: Record<string, string> = {
    message,
    content: Buffer.from(bytes).toString("base64"),
    branch: getPublishingBranch(),
  };
  if (current?.sha) body.sha = current.sha;

  const response = await github(contentUrl(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[nextgen-admin] media upload failed", response.status, detail);
    throw new Error(`GitHub rejected the media upload (${response.status}).`);
  }

  const data = (await response.json()) as {
    commit?: { sha?: string; html_url?: string };
  };

  return {
    sha: data.commit?.sha ?? "",
    url: data.commit?.html_url ?? "",
    branch: getPublishingBranch(),
  };
}

export async function deleteRepositoryFile(path: string, message: string) {
  const current = await getRepositoryFile(path);
  if (!current) throw new Error("The file no longer exists.");

  const response = await github(contentUrl(path), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      sha: current.sha,
      branch: getPublishingBranch(),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[nextgen-admin] media delete failed", response.status, detail);
    throw new Error(`GitHub rejected the media deletion (${response.status}).`);
  }

  const data = (await response.json()) as {
    commit?: { sha?: string; html_url?: string };
  };

  return {
    sha: data.commit?.sha ?? "",
    url: data.commit?.html_url ?? "",
    branch: getPublishingBranch(),
  };
}

export async function readAdminContent(kind: ContentKind) {
  const file = await getRepositoryFile(contentPaths[kind]);
  if (!file) throw new Error(`${contentPaths[kind]} does not exist in GitHub.`);
  return JSON.parse(file.content) as unknown[];
}

export async function publishAdminContent(kind: ContentKind, items: unknown[]) {
  return writeRepositoryFile(
    contentPaths[kind],
    JSON.stringify(items, null, 2) + "\n",
    `content: update ${kind} from admin`
  );
}

async function getBranchTreeSha() {
  const repository = getRepository();
  const branch = getPublishingBranch();
  const ref = await github(
    `/repos/${repository}/git/ref/heads/${encodeURIComponent(branch)}`
  );
  if (!ref.ok) throw new Error(`Could not resolve branch ${branch}.`);

  const refData = (await ref.json()) as { object: { sha: string } };
  const commit = await github(
    `/repos/${repository}/git/commits/${refData.object.sha}`
  );
  if (!commit.ok) throw new Error("Could not resolve the Git tree.");

  const commitData = (await commit.json()) as { tree: { sha: string } };
  return commitData.tree.sha;
}

export async function listSiteMedia() {
  const treeSha = await getBranchTreeSha();
  const response = await github(
    `/repos/${getRepository()}/git/trees/${treeSha}?recursive=1`
  );
  if (!response.ok) throw new Error("Could not list repository media.");

  const data = (await response.json()) as {
    tree: Array<{ path: string; type: string; size?: number; sha: string }>;
  };

  return data.tree
    .filter(
      (item) =>
        item.type === "blob" &&
        item.path.startsWith("public/assets/images/") &&
        /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(item.path)
    )
    .map((item) => ({
      path: item.path,
      publicPath: "/" + item.path.replace(/^public\//, ""),
      name: item.path.split("/").pop() || item.path,
      size: item.size ?? 0,
      sha: item.sha,
      deletable: item.path.startsWith("public/assets/images/uploads/"),
      source: item.path.startsWith("public/assets/images/uploads/") ? "upload" : "site",
    }))
    .sort((a, b) => {
      if (a.source !== b.source) return a.source === "upload" ? -1 : 1;
      return a.publicPath.localeCompare(b.publicPath);
    });
}

export async function getPublishingStatus() {
  const missing = [
    "GITHUB_APP_ID",
    "GITHUB_APP_INSTALLATION_ID",
  ].filter((name) => !process.env[name]?.trim());

  if (
    !process.env.GITHUB_APP_PRIVATE_KEY_BASE64?.trim() &&
    !process.env.GITHUB_APP_PRIVATE_KEY?.trim()
  ) {
    missing.push("GITHUB_APP_PRIVATE_KEY_BASE64");
  }

  if (missing.length) {
    return {
      connected: false,
      branch: getPublishingBranch(),
      repository: getRepository(),
      missing,
      message: "GitHub App publishing is not configured yet.",
    };
  }

  try {
    const response = await github(`/repos/${getRepository()}`);
    if (!response.ok) {
      return {
        connected: false,
        branch: getPublishingBranch(),
        repository: getRepository(),
        missing: [] as string[],
        message: `GitHub App cannot access the repository (${response.status}).`,
      };
    }

    return {
      connected: true,
      branch: getPublishingBranch(),
      repository: getRepository(),
      missing: [] as string[],
      message: "GitHub App can publish to the repository.",
    };
  } catch (error) {
    return {
      connected: false,
      branch: getPublishingBranch(),
      repository: getRepository(),
      missing: [] as string[],
      message: error instanceof Error ? error.message : "GitHub App connection failed.",
    };
  }
}
