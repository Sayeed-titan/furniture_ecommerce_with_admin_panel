import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PageHeader, StatusPill, type PillTone } from "@/components/admin/ui";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { isGithubConfigured } from "@/lib/github";
import { retryIssueSync, deleteIssueReport } from "@/lib/actions/issues";
import { cn } from "@/lib/utils";

export const metadata = { title: "Issue Reports" };
export const dynamic = "force-dynamic";

const TYPES = ["BUG", "FEATURE", "CHANGE", "QUESTION"] as const;

const TYPE_TONE: Record<string, PillTone> = {
  BUG: "red",
  FEATURE: "purple",
  CHANGE: "amber",
  QUESTION: "blue",
};
const TYPE_LABEL: Record<string, string> = {
  BUG: "Bug",
  FEATURE: "Feature",
  CHANGE: "Change",
  QUESTION: "Question",
};

type SearchParams = Promise<{ type?: string }>;

export default async function AdminIssuesPage({ searchParams }: { searchParams: SearchParams }) {
  const { type } = await searchParams;
  const activeType = TYPES.includes(type as (typeof TYPES)[number]) ? type : undefined;

  const where: Prisma.IssueReportWhereInput = activeType
    ? { type: activeType as Prisma.EnumIssueTypeFilter["equals"] }
    : {};

  const [reports, counts] = await Promise.all([
    prisma.issueReport.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.issueReport.groupBy({ by: ["type"], _count: true }),
  ]);

  const githubReady = isGithubConfigured();
  const countFor = (t: string) => counts.find((c) => c.type === t)?._count ?? 0;
  const total = counts.reduce((s, c) => s + c._count, 0);

  const tabs = [
    { key: undefined, label: "All", count: total },
    ...TYPES.map((t) => ({ key: t, label: TYPE_LABEL[t], count: countFor(t) })),
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Issue reports"
        description="Requests submitted from the website. Each is stored here and, when GitHub is on, opened as an issue in your repo."
      >
        <StatusPill tone={githubReady ? "green" : "neutral"}>
          {githubReady ? "GitHub sync on" : "GitHub sync off"}
        </StatusPill>
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = activeType === tab.key || (!activeType && tab.key === undefined);
          return (
            <Link
              key={tab.label}
              href={tab.key ? `/admin/issues?type=${tab.key}` : "/admin/issues"}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
              )}
            >
              {tab.label}
              <span className={cn("text-xs", active ? "text-white/70" : "text-neutral-400")}>{tab.count}</span>
            </Link>
          );
        })}
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone={TYPE_TONE[report.type] ?? "neutral"}>{TYPE_LABEL[report.type] ?? report.type}</StatusPill>
                  <h2 className="font-medium text-neutral-900">{report.title}</h2>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">{report.body}</p>
                <p className="mt-3 text-xs text-neutral-500">
                  {report.reporterName || "Anonymous"}
                  {report.reporterEmail ? ` · ${report.reporterEmail}` : ""} · {report.createdAt.toLocaleString()}
                </p>
                {report.pageUrl && <p className="mt-1 truncate text-xs text-neutral-400">From: {report.pageUrl}</p>}
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                {report.githubIssueUrl ? (
                  <a
                    href={report.githubIssueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 hover:text-neutral-600"
                  >
                    #{report.githubIssueNumber} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <StatusPill tone={report.syncError ? "red" : "neutral"}>
                    {report.syncError ? "Sync failed" : "Not synced"}
                  </StatusPill>
                )}
                <div className="flex items-center gap-1">
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
                    <ConfirmSubmit message="Delete this report?" variant="danger" className="text-xs">
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </div>

            {report.syncError && (
              <p className="mt-3 rounded-md bg-red-50 p-2 text-xs text-red-700">{report.syncError}</p>
            )}
          </div>
        ))}
        {reports.length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-300 py-16 text-center text-sm text-neutral-500">
            {activeType ? `No ${TYPE_LABEL[activeType!].toLowerCase()} reports.` : "No issue reports yet."}
          </p>
        )}
      </div>
    </div>
  );
}
