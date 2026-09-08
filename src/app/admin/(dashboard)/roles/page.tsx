import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { sanitizePermissions, allPermissions } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section, SectionHeader } from "@/components/admin/ui";
import { RolePermissionGrid } from "@/components/admin/role-permission-grid";
import { RoleRow } from "@/components/admin/role-row";
import { createRole } from "@/lib/actions/roles";

export const metadata = { title: "Roles" };
export const dynamic = "force-dynamic";

export default async function AdminRolesPage() {
  await requirePermission("users.edit");

  const roles = await prisma.role.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { users: true } } },
  });

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        title="Roles"
        description="Control which admin pages a role can see and which actions it can run."
      />

      <Section>
        <SectionHeader title="Add a role" />
        <form action={createRole} className="space-y-4 p-5">
          <div className="max-w-xs space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <RolePermissionGrid />
          <Button type="submit">
            <Plus className="h-4 w-4" /> Create role
          </Button>
        </form>
      </Section>

      <Section>
        <SectionHeader title="All roles" description={`${roles.length} total`} />
        <ul className="divide-y divide-neutral-100">
          {roles.map((r) => (
            <RoleRow
              key={r.id}
              id={r.id}
              name={r.name}
              isProtected={r.isProtected}
              // Protected roles always have every permission (enforced in
              // src/lib/authz.ts regardless of what's stored) — reflect
              // that here too, so the display can't drift from reality.
              permissions={r.isProtected ? allPermissions() : sanitizePermissions(r.permissions)}
              userCount={r._count.users}
            />
          ))}
        </ul>
      </Section>
    </div>
  );
}
