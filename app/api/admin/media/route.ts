import { del, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import {
  deleteRepositoryFile,
  getPublishingBranch,
  listSiteMedia,
} from "@/lib/github-admin";

async function authorized() {
  return Boolean(await getAdminSession());
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

function blobErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (
    /BLOB_STORE_ID|BLOB_READ_WRITE_TOKEN|OIDC|store|token|credential/i.test(message)
  ) {
    return "Vercel Blob is not connected to this project yet.";
  }

  return message || "Could not access Vercel Blob.";
}

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const repositoryFiles = (await listSiteMedia()).map((file) => ({
      ...file,
      source: file.source === "upload" ? "repository-upload" : "site",
    }));

    let blobFiles: Array<{
      path: string;
      publicPath: string;
      name: string;
      size: number;
      sha: string;
      deletable: boolean;
      source: "blob";
    }> = [];
    let blobConnected = true;
    let blobError = "";

    try {
      const result = await list({
        prefix: "nextgen-media/",
        limit: 1000,
      });

      blobFiles = result.blobs.map((blob) => ({
        path: blob.pathname,
        publicPath: blob.url,
        name: blob.pathname.split("/").pop() || blob.pathname,
        size: blob.size,
        sha: blob.etag,
        deletable: true,
        source: "blob" as const,
      }));
    } catch (error) {
      blobConnected = false;
      blobError = blobErrorMessage(error);
    }

    const files = [...blobFiles, ...repositoryFiles];

    return NextResponse.json({
      files,
      branch: getPublishingBranch(),
      blobConnected,
      blobError,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not load media.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      path?: string;
      source?: "blob" | "repository-upload" | "site";
    };

    const path = body.path?.trim() || "";

    if (body.source === "blob") {
      if (!path.startsWith("nextgen-media/")) {
        return NextResponse.json(
          { error: "Invalid Blob media path." },
          { status: 400 }
        );
      }

      await del(path);

      return NextResponse.json({
        ok: true,
        changed: true,
        storage: "blob",
      });
    }

    if (
      body.source === "repository-upload" &&
      path.startsWith("public/assets/images/uploads/")
    ) {
      const result = await deleteRepositoryFile(
        path,
        `media: remove ${path.split("/").pop() || "upload"} from admin`
      );

      return NextResponse.json({
        ok: true,
        storage: "github",
        ...result,
      });
    }

    return NextResponse.json(
      { error: "This site asset is read-only in Media." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not delete image.",
      },
      { status: 500 }
    );
  }
}
