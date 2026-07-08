import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;

  return (
    <AdminShell
      userName={user?.name}
      userEmail={user?.email}
      role={(user as { role?: string } | undefined)?.role}
    >
      {children}
    </AdminShell>
  );
}
