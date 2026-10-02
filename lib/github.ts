export type RepoActivity = { updatedAt?: string; latestCommit?: string; url?: string };

export async function getRepoActivity(repo: string): Promise<RepoActivity> {
  const headers: HeadersInit = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, {headers, next:{revalidate:3600}});
    if (!res.ok) return {};
    const data = await res.json();
    const commit = Array.isArray(data) ? data[0] : undefined;
    return {updatedAt:commit?.commit?.author?.date,latestCommit:commit?.commit?.message?.split("\n")[0],url:commit?.html_url};
  } catch { return {}; }
}
