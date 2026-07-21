import Link from "next/link";
import { Package, Tags, Inbox, Bug, ArrowRight, Plus, ShoppingCart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, Section, SectionHeader, StatusPill, EmptyRow } from "@/components/admin/ui";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const LEAD_TONE: Record<string, "blue" | "amber" | "purple" | "green" | "red"> = {
  NEW: "blue",
  CONTACTED: "amber",
  QUALIFIED: "purple",
  CLOSED_WON: "green",
  CLOSED_LOST: "red",
};

export default async function AdminDashboardPage() {
  const [
    productCount,
    categoryCount,
    newLeadCount,
    totalLeadCount,
    openIssueCount,
    recentLeads,
    recentIssues,
    featuredCount,
    newOrderCount,
    paidOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count(),
    prisma.issueReport.count({ where: { githubIssueUrl: null } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    prisma.issueReport.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.product.count({ where: { featured: true } }),
    prisma.order.count({ where: { status: "PLACED" } }),
    prisma.order.findMany({ where: { paymentStatus: "PAID" }, select: { total: true } }),
  ]);

  const revenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);

  const stats = [
    { label: "Products", value: productCount, sub: `${featuredCount} featured`, icon: Package, href: "/admin/products" },
    { label: "Categories", value: categoryCount, sub: "in catalog", icon: Tags, href: "/admin/categories" },
    {
      label: "New orders",
      value: newOrderCount,
      sub: `${formatPrice(revenue)} paid revenue`,
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    { label: "New leads", value: newLeadCount, sub: `${totalLeadCount} total`, icon: Inbox, href: "/admin/leads" },
    { label: "Unsynced issues", value: openIssueCount, sub: "need attention", icon: Bug, href: "/admin/issues" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="At-a-glance view of your store and inbox.">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white">
                <Icon className="h-4 w-4" />
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-500" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-neutral-900">{value}</p>
            <p className="text-sm font-medium text-neutral-600">{label}</p>
            <p className="text-xs text-neutral-400">{sub}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section>
          <SectionHeader title="Recent leads">
            <Link href="/admin/leads" className="text-sm font-medium text-neutral-500 hover:text-neutral-900">
              View all
            </Link>
          </SectionHeader>
          <ul className="divide-y divide-neutral-100">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-neutral-900">{lead.name}</p>
                  <p className="truncate text-sm text-neutral-500">
                    {lead.email}
                    {lead.items.length ? ` · ${lead.items.length} item${lead.items.length === 1 ? "" : "s"}` : ""}
                  </p>
                </div>
                <StatusPill tone={LEAD_TONE[lead.status] ?? "neutral"}>
                  {lead.status.replace("_", " ")}
                </StatusPill>
              </li>
            ))}
            {recentLeads.length === 0 && <EmptyRow>No leads yet.</EmptyRow>}
          </ul>
        </Section>

        <Section>
          <SectionHeader title="Recent issue reports">
            <Link href="/admin/issues" className="text-sm font-medium text-neutral-500 hover:text-neutral-900">
              View all
            </Link>
          </SectionHeader>
          <ul className="divide-y divide-neutral-100">
            {recentIssues.map((issue) => (
              <li key={issue.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-neutral-900">{issue.title}</p>
                  <p className="truncate text-sm text-neutral-500">{issue.reporterName || "Anonymous"}</p>
                </div>
                <StatusPill tone={issue.githubIssueUrl ? "green" : issue.syncError ? "red" : "neutral"}>
                  {issue.githubIssueUrl ? "Synced" : issue.syncError ? "Failed" : "Local"}
                </StatusPill>
              </li>
            ))}
            {recentIssues.length === 0 && <EmptyRow>No issue reports yet.</EmptyRow>}
          </ul>
        </Section>
      </div>
    </div>
  );
}
