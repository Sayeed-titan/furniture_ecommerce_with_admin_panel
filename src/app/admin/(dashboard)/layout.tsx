import { getAdminSession } from "@/lib/authz";
import { getAllSettings, SETTING_KEYS } from "@/lib/settings";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, permissions } = await getAdminSession();
  const settings = await getAllSettings();

  return (
    <AdminShell
      userName={user?.name}
      userEmail={user?.email}
      role={user?.roleName}
      permissions={permissions}
      brandIconUrl={settings[SETTING_KEYS.brandIconUrl]}
      brandLogoUrl={settings[SETTING_KEYS.brandLogoUrl]}
    >
      {children}
    </AdminShell>
  );
}
