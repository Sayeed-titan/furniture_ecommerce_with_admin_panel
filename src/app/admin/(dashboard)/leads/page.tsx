import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PageHeader, StatusPill, type PillTone } from "@/components/admin/ui";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { updateLeadStatus, deleteLead } from "@/lib/actions/leads";
import { cn } from "@/lib/utils";

export const metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED_WON", "CLOSED_LOST"] as const;

const STATUS_TONE: Record<string, PillTone> = {
  NEW: "blue",
  CONTACTED: "amber",
  QUALIFIED: "purple",
  CLOSED_WON: "green",
  CLOSED_LOST: "red",
};

const label = (s: string) => s.replace("_", " ");

type SearchParams = Promise<{ status?: string }>;

export default async function AdminLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const { status } = await searchParams;
  const activeStatus = STATUSES.includes(status as (typeof STATUSES)[number]) ? status : undefined;

  const where: Prisma.LeadWhereInput = activeStatus
    ? { status: activeStatus as Prisma.EnumLeadStatusFilter["equals"] }
    : {};

  const [leads, counts] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: { select: { name: true } } } } },
    }),
    prisma.lead.groupBy({ by: ["status"], _count: true }),
  ]);

  const countFor = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;
  const total = counts.reduce((sum, c) => sum + c._count, 0);

  const tabs = [
    { key: undefined, label: "All", count: total },
    ...STATUSES.map((s) => ({ key: s, label: label(s), count: countFor(s) })),
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Leads" description="People who reached out through the site. Update status as you work them." />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = activeStatus === tab.key || (!activeStatus && tab.key === undefined);
          return (
            <Link
              key={tab.label}
              href={tab.key ? `/admin/leads?status=${tab.key}` : "/admin/leads"}
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
        {leads.map((lead) => {
          const updateStatus = updateLeadStatus.bind(null, lead.id);
          return (
            <div key={lead.id} className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-900">{lead.name}</p>
                    <StatusPill tone={STATUS_TONE[lead.status] ?? "neutral"}>{label(lead.status)}</StatusPill>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900">
                      <Mail className="h-3.5 w-3.5" /> {lead.email}
                    </a>
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900">
                        <Phone className="h-3.5 w-3.5" /> {lead.phone}
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-xs text-neutral-400">{lead.createdAt.toLocaleDateString()}</p>
              </div>

              {lead.message && (
                <p className="mt-3 whitespace-pre-wrap rounded-md bg-neutral-50 p-3 text-sm text-neutral-700">{lead.message}</p>
              )}

              {lead.items.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-neutral-500">Interested in:</p>
                  <ul className="mt-1 flex flex-wrap gap-1.5">
                    {lead.items.map((item) => (
                      <li key={item.id} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
                        {item.product.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-4">
                <form action={updateStatus} className="flex items-center gap-2">
                  <select
                    name="status"
                    defaultValue={lead.status}
                    className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {label(s)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
                  >
                    Update status
                  </button>
                </form>
                <form action={deleteLead}>
                  <input type="hidden" name="id" value={lead.id} />
                  <ConfirmSubmit message={`Delete lead from ${lead.name}?`} variant="danger">
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          );
        })}
        {leads.length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-300 py-16 text-center text-sm text-neutral-500">
            {activeStatus ? `No ${label(activeStatus).toLowerCase()} leads.` : "No leads yet."}
          </p>
        )}
      </div>
    </div>
  );
}
