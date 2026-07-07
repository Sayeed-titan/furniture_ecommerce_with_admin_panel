import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { updateLeadStatus } from "@/lib/actions/leads";

export const metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const statusOptions = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED_WON", "CLOSED_LOST"];

const statusVariant: Record<string, "default" | "secondary" | "success" | "destructive"> = {
  NEW: "default",
  CONTACTED: "secondary",
  QUALIFIED: "secondary",
  CLOSED_WON: "success",
  CLOSED_LOST: "destructive",
};

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>

      <div className="mt-6 space-y-4">
        {leads.map((lead) => {
          const updateStatus = updateLeadStatus.bind(null, lead.id);
          return (
            <div key={lead.id} className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-neutral-600">{lead.email}</p>
                  {lead.phone && <p className="text-sm text-neutral-600">{lead.phone}</p>}
                </div>
                <Badge variant={statusVariant[lead.status] ?? "secondary"}>{lead.status}</Badge>
              </div>

              {lead.message && (
                <p className="mt-3 rounded-md bg-neutral-50 p-3 text-sm text-neutral-700">
                  {lead.message}
                </p>
              )}

              {lead.items.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-neutral-500">Interested in:</p>
                  <ul className="mt-1 flex flex-wrap gap-2">
                    {lead.items.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
                      >
                        {item.product.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <form action={updateStatus} className="mt-4 flex items-center gap-2">
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
                >
                  Update
                </button>
              </form>
            </div>
          );
        })}
        {leads.length === 0 && (
          <p className="text-sm text-neutral-500">No leads yet.</p>
        )}
      </div>
    </div>
  );
}
