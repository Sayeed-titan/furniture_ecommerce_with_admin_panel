/**
 * Server-only. Thin GitHub REST wrapper for opening issues from the website.
 * Uses fetch
 * (no SDK) so there are no extra dependencies. Configured entirely via env:
 *
 *   GITHUB_TOKEN        fine-grained PAT with Issues: read & write
 *   GITHUB_REPO_OWNER   e.g. "sayeed-titan"
 *   GITHUB_REPO_NAME    e.g. "furniture_ecommerce_with_admin_panel"
 *
 * When the token/repo aren't set, isGithubConfigured() returns false and the
 * caller should skip syncing (the report is still persisted locally).
 */

export function isGithubConfigured(): boolean {
  return Boolean(
    process.env.GITHUB_TOKEN &&
      process.env.GITHUB_REPO_OWNER &&
      process.env.GITHUB_REPO_NAME
  );
}

export type CreatedIssue = {
  number: number;
  url: string;
};

export async function createGithubIssue(input: {
  title: string;
  body: string;
  labels?: string[];
}): Promise<CreatedIssue> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!token || !owner || !repo) {
    throw new Error("GitHub is not configured");
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      "User-Agent": "president-furniture-site",
    },
    body: JSON.stringify({
      title: input.title,
      body: input.body,
      labels: input.labels,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GitHub responded ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as { number: number; html_url: string };
  return { number: data.number, url: data.html_url };
}

/** Maps our IssueType enum to sensible GitHub labels. */
export function labelsForIssueType(type: string): string[] {
  const base = ["from-website"];
  switch (type) {
    case "BUG":
      return [...base, "bug"];
    case "FEATURE":
      return [...base, "enhancement"];
    case "CHANGE":
      return [...base, "change-request"];
    case "QUESTION":
      return [...base, "question"];
    default:
      return base;
  }
}
