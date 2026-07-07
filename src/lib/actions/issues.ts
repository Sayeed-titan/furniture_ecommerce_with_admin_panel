"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createGithubIssue, isGithubConfigured, labelsForIssueType } from "@/lib/github";

const TYPE_LABEL: Record<string, string> = {
  BUG: "Bug",
  FEATURE: "Feature request",
  CHANGE: "Change request",
  QUESTION: "Question",
};

/** Retry pushing a locally-stored report to GitHub (e.g. after a token was added). */
export async function retryIssueSync(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id || !isGithubConfigured()) return;

  const report = await prisma.issueReport.findUnique({ where: { id } });
  if (!report || report.githubIssueUrl) return;

  const reporter = report.reporterName || report.reporterEmail || "an anonymous visitor";
  const issueBody = [
    report.body,
    "",
    "---",
    `*Submitted from the website by ${reporter}.*`,
    report.reporterEmail ? `*Contact: ${report.reporterEmail}*` : null,
    report.pageUrl ? `*Page: ${report.pageUrl}*` : null,
    `*Type: ${TYPE_LABEL[report.type]}*`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const issue = await createGithubIssue({
      title: report.title,
      body: issueBody,
      labels: labelsForIssueType(report.type),
    });
    await prisma.issueReport.update({
      where: { id },
      data: { githubIssueNumber: issue.number, githubIssueUrl: issue.url, syncError: null },
    });
  } catch (err) {
    await prisma.issueReport.update({
      where: { id },
      data: { syncError: err instanceof Error ? err.message : "Unknown error" },
    });
  }

  revalidatePath("/admin/issues");
}

export async function deleteIssueReport(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.issueReport.delete({ where: { id } });
  revalidatePath("/admin/issues");
}
