import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, newLeadCount, totalLeadCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count(),
  ]);

  const stats = [
    { label: "Products", value: productCount },
    { label: "Categories", value: categoryCount },
    { label: "New Leads", value: newLeadCount },
    { label: "Total Leads", value: totalLeadCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">{s.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-semibold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
