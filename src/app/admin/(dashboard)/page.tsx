import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, newLeadCount, totalLeadCount, issueCount, openIssueCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count(),
      prisma.issueReport.count(),
      prisma.issueReport.count({ where: { githubIssueUrl: null } }),
    ]);

  const stats = [
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "Categories", value: categoryCount, href: "/admin/categories" },
    { label: "New Leads", value: newLeadCount, href: "/admin/leads" },
    { label: "Total Leads", value: totalLeadCount, href: "/admin/leads" },
    { label: "Issue Reports", value: issueCount, href: "/admin/issues" },
    { label: "Unsynced Issues", value: openIssueCount, href: "/admin/issues" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-neutral-500">{s.label}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-3xl font-semibold">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
