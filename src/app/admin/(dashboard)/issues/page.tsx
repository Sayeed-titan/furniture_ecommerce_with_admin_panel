import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { isGithubConfigured } from "@/lib/github";
import { retryIssueSync, deleteIssueReport } from "@/lib/actions/issues";

export const metadata = { title: "Issue Reports" };
export const dynamic = "force-dynamic";

const typeVariant: Record<string, "default" | "secondary" | "warning" | "destructive"> = {
  BUG: "destructive",
  FEATURE: "secondary",
  CHANGE: "warning",
  QUESTION: "default",
};

const typeLabel: Record<string, string> = {
  BUG: "Bug",
  FEATURE: "Feature",
  CHANGE: "Change",
  QUESTION: "Question",
};

export default async function AdminIssuesPage() {
  const reports = await prisma.issueReport.findMany({ orderBy: { createdAt: "desc" } });
  const githubReady = isGithubConfigured();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Issue Reports</h1>
        <Badge variant={githubReady ? "success" : "secondary"}>
          {githubReady ? "GitHub sync on" : "GitHub sync off"}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-neutral-500">
        Requests submitted from the website. Each is stored here and, when GitHub is
        configured, opened as an issue in your repo.
      </p>

      <div className="mt-6 space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={typeVariant[report.type] ?? "secondary"}>
                    {typeLabel[report.type] ?? report.type}
                  </Badge>
                  <h2 className="font-medium text-neutral-900">{report.title}</h2>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">{report.body}</p>
                <p className="mt-3 text-xs text-neutral-500">
                  {report.reporterName || "Anonymous"}
                  {report.reporterEmail ? ` · ${report.reporterEmail}` : ""} ·{" "}
                  {report.createdAt.toLocaleString()}
                </p>
                {report.pageUrl && (
                  <p className="mt-1 truncate text-xs text-neutral-400">From: {report.pageUrl}</p>
                )}
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                {report.githubIssueUrl ? (
                  <a
                    href={report.githubIssueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                  >
                    #{report.githubIssueNumber} on GitHub ↗
                  </a>
                ) : (
                  <Badge variant={report.syncError ? "destructive" : "secondary"}>
                    {report.syncError ? "Sync failed" : "Not synced"}
                  </Badge>
                )}

                <div className="flex gap-2">
                  {!report.githubIssueUrl && githubReady && (
                    <form action={retryIssueSync}>
                      <input type="hidden" name="id" value={report.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100"
                      >
                        Retry sync
                      </button>
                    </form>
                  )}
                  <form action={deleteIssueReport}>
                    <input type="hidden" name="id" value={report.id} />
                    <button
                      type="submit"
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {report.syncError && (
              <p className="mt-3 rounded-md bg-red-50 p-2 text-xs text-red-700">
                {report.syncError}
              </p>
            )}
          </div>
        ))}
        {reports.length === 0 && (
          <p className="text-sm text-neutral-500">No issue reports yet.</p>
        )}
      </div>
    </div>
  );
}
