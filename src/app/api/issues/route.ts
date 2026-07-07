import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createGithubIssue, isGithubConfigured, labelsForIssueType } from "@/lib/github";
import { escapeHtml, sendNotification } from "@/lib/email";

const issueSchema = z.object({
  type: z.enum(["BUG", "FEATURE", "CHANGE", "QUESTION"]),
  title: z.string().min(3).max(200),
  body: z.string().min(10).max(5000),
  reporterName: z.string().max(200).optional(),
  reporterEmail: z.string().email().max(200).optional().or(z.literal("")),
  pageUrl: z.string().max(500).optional(),
});

const TYPE_LABEL: Record<string, string> = {
  BUG: "Bug",
  FEATURE: "Feature request",
  CHANGE: "Change request",
  QUESTION: "Question",
};

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = issueSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { type, title, body, reporterName, pageUrl } = parsed.data;
  const reporterEmail = parsed.data.reporterEmail || undefined;

  // 1. Persist locally first — this is the source of truth, so a report is
  //    never lost even if GitHub/email are down or unconfigured.
  const report = await prisma.issueReport.create({
    data: { type, title, body, reporterName, reporterEmail, pageUrl },
  });

  // 2. Best-effort sync to GitHub.
  if (isGithubConfigured()) {
    const reporter = reporterName || reporterEmail || "an anonymous visitor";
    const issueBody = [
      body,
      "",
      "---",
      `*Submitted from the website by ${reporter}.*`,
      reporterEmail ? `*Contact: ${reporterEmail}*` : null,
      pageUrl ? `*Page: ${pageUrl}*` : null,
      `*Type: ${TYPE_LABEL[type]}*`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const issue = await createGithubIssue({
        title,
        body: issueBody,
        labels: labelsForIssueType(type),
      });
      await prisma.issueReport.update({
        where: { id: report.id },
        data: {
          githubIssueNumber: issue.number,
          githubIssueUrl: issue.url,
          syncError: null,
        },
      });
    } catch (err) {
      await prisma.issueReport.update({
        where: { id: report.id },
        data: { syncError: err instanceof Error ? err.message : "Unknown error" },
      });
    }
  }

  // 3. Best-effort email notification to the business.
  await sendNotification({
    subject: `New ${TYPE_LABEL[type]} from the website: ${title}`,
    replyTo: reporterEmail,
    html: `
      <h2>${escapeHtml(TYPE_LABEL[type])}: ${escapeHtml(title)}</h2>
      <p style="white-space:pre-wrap">${escapeHtml(body)}</p>
      <hr />
      <p><strong>From:</strong> ${escapeHtml(reporterName || "—")} ${
        reporterEmail ? `(${escapeHtml(reporterEmail)})` : ""
      }</p>
      ${pageUrl ? `<p><strong>Page:</strong> ${escapeHtml(pageUrl)}</p>` : ""}
    `,
  });

  return NextResponse.json({ id: report.id }, { status: 201 });
}
