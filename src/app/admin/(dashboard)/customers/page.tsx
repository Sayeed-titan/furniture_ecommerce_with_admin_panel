import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { PageHeader, Section, StatusPill, EmptyRow } from "@/components/admin/ui";
import { SearchInput } from "@/components/admin/search-input";
import { SortLink } from "@/components/admin/sort-link";

export const metadata = { title: "Customers" };
export const dynamic = "force-dynamic";

const SORT_FIELDS = ["name", "createdAt", "orders"] as const;
type SortField = (typeof SORT_FIELDS)[number];

type SearchParams = Promise<{ q?: string; sort?: string; dir?: string }>;

export default async function AdminCustomersPage({ searchParams }: { searchParams: SearchParams }) {
  await requirePermission("customers.view");
  const { q, sort, dir } = await searchParams;

  const sortField: SortField = SORT_FIELDS.includes(sort as SortField) ? (sort as SortField) : "createdAt";
  const sortDir: "asc" | "desc" = dir === "asc" ? "asc" : "desc";

  const where: Prisma.CustomerWhereInput = q?.trim()
    ? {
        OR: [
          { name: { contains: q.trim() } },
          { email: { contains: q.trim() } },
          { phone: { contains: q.trim() } },
        ],
      }
    : {};

  const orderBy: Prisma.CustomerOrderByWithRelationInput =
    sortField === "orders"
      ? { orders: { _count: sortDir } }
      : sortField === "name"
        ? { name: sortDir }
        : { createdAt: sortDir };

  const customers = await prisma.customer.findMany({
    where,
    orderBy,
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader
        title="Customers"
        description='Storefront accounts. Click a row for full details, or use "Send reset link" if someone contacts you locked out.'
      />

      <SearchInput placeholder="Search name, email, phone..." />

      <Section className="overflow-hidden">
        {customers.length === 0 ? (
          <EmptyRow>{q ? "No customers match this search." : "No customer accounts yet."}</EmptyRow>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    <SortLink field="name" label="Customer" activeField={sortField} activeDir={sortDir} />
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <SortLink field="orders" label="Orders" activeField={sortField} activeDir={sortDir} />
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <SortLink field="createdAt" label="Joined" activeField={sortField} activeDir={sortDir} />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/60">
                    <td className="px-4 py-3">
                      <Link href={`/admin/customers/${c.id}`} className="block">
                        <p className="font-medium text-neutral-900">{c.name}</p>
                        <p className="text-sm text-neutral-500">{c.email}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill tone="neutral">
                        {c._count.orders} order{c._count.orders === 1 ? "" : "s"}
                      </StatusPill>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">{c.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}
