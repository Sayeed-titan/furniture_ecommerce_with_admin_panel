import Link from "next/link";
import { Eye, Heart, Inbox, TrendingUp, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, Section, SectionHeader, StatusPill, EmptyRow, type PillTone } from "@/components/admin/ui";

export const metadata = { title: "Insights" };
export const dynamic = "force-dynamic";

const LEAD_TONE: Record<string, PillTone> = {
  NEW: "blue",
  CONTACTED: "amber",
  QUALIFIED: "purple",
  CLOSED_WON: "green",
  CLOSED_LOST: "red",
};

const STATUS_ORDER = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED_WON", "CLOSED_LOST"] as const;

export default async function InsightsPage() {
  // eslint-disable-next-line react-hooks/purity -- server component; evaluated per request
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalViews, totalLeads, leads30, wonCount, mostViewed, interestGroups, statusGroups] =
    await Promise.all([
      prisma.product.aggregate({ _sum: { viewCount: true } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.lead.count({ where: { status: "CLOSED_WON" } }),
      prisma.product.findMany({
        orderBy: { viewCount: "desc" },
        take: 8,
        select: { id: true, name: true, slug: true, viewCount: true },
      }),
      prisma.leadItem.groupBy({
        by: ["productId"],
        _count: { productId: true },
        orderBy: { _count: { productId: "desc" } },
        take: 8,
      }),
      prisma.lead.groupBy({ by: ["status"], _count: { status: true } }),
    ]);

  // Resolve product names for the "most wishlisted" list.
  const interestIds = interestGroups.map((g) => g.productId);
  const interestProducts = interestIds.length
    ? await prisma.product.findMany({
        where: { id: { in: interestIds } },
        select: { id: true, name: true, slug: true },
      })
    : [];
  const nameById = new Map(interestProducts.map((p) => [p.id, p]));
  const topInterest = interestGroups
    .map((g) => ({ product: nameById.get(g.productId), count: g._count.productId }))
    .filter((r) => r.product);

  const statusCount = new Map(statusGroups.map((g) => [g.status, g._count.status]));
  const maxStatus = Math.max(1, ...STATUS_ORDER.map((s) => statusCount.get(s) ?? 0));

  const views = totalViews._sum.viewCount ?? 0;
  const conversion = totalLeads > 0 ? Math.round((wonCount / totalLeads) * 100) : 0;

  const stats = [
    { label: "Product views", value: views, sub: "all time", icon: Eye },
    { label: "Total leads", value: totalLeads, sub: `${leads30} in last 30 days`, icon: Inbox },
    { label: "Leads (30 days)", value: leads30, sub: "recent demand", icon: TrendingUp },
    { label: "Won rate", value: `${conversion}%`, sub: `${wonCount} closed won`, icon: Heart },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insights"
        description="What visitors look at and enquire about — so you know what to stock and push."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-neutral-200 bg-white p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-4 text-3xl font-semibold text-neutral-900">{value}</p>
            <p className="text-sm font-medium text-neutral-600">{label}</p>
            <p className="text-xs text-neutral-400">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Most viewed */}
        <Section>
          <SectionHeader title="Most viewed products" description="By total detail-page views." />
          <ul className="divide-y divide-neutral-100">
            {mostViewed.map((p, i) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-5 shrink-0 text-sm font-semibold text-neutral-400">{i + 1}</span>
                  <Link
                    href={`/products/${p.slug}`}
                    target="_blank"
                    className="truncate font-medium text-neutral-900 hover:underline"
                  >
                    {p.name}
                  </Link>
                </div>
                <StatusPill tone="neutral">
                  <Eye className="h-3 w-3" /> {p.viewCount}
                </StatusPill>
              </li>
            ))}
            {mostViewed.length === 0 && <EmptyRow>No product views yet.</EmptyRow>}
          </ul>
        </Section>

        {/* Most wishlisted / enquired */}
        <Section>
          <SectionHeader
            title="Most enquired products"
            description="Products that appear on the most leads."
          />
          <ul className="divide-y divide-neutral-100">
            {topInterest.map((row, i) => (
              <li key={row.product!.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-5 shrink-0 text-sm font-semibold text-neutral-400">{i + 1}</span>
                  <Link
                    href={`/products/${row.product!.slug}`}
                    target="_blank"
                    className="truncate font-medium text-neutral-900 hover:underline"
                  >
                    {row.product!.name}
                  </Link>
                </div>
                <StatusPill tone="purple">
                  <Heart className="h-3 w-3" /> {row.count}
                </StatusPill>
              </li>
            ))}
            {topInterest.length === 0 && <EmptyRow>No enquiries with products yet.</EmptyRow>}
          </ul>
        </Section>
      </div>

      {/* Lead status funnel */}
      <Section>
        <SectionHeader title="Lead pipeline" description="Where your leads currently sit.">
          <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900">
            View leads <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </SectionHeader>
        <div className="space-y-3 p-5">
          {STATUS_ORDER.map((status) => {
            const count = statusCount.get(status) ?? 0;
            const pct = Math.round((count / maxStatus) * 100);
            return (
              <div key={status} className="flex items-center gap-3">
                <div className="w-28 shrink-0">
                  <StatusPill tone={LEAD_TONE[status]}>{status.replace("_", " ")}</StatusPill>
                </div>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-900 transition-all"
                    style={{ width: `${count === 0 ? 0 : Math.max(pct, 4)}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-sm font-semibold text-neutral-700">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
