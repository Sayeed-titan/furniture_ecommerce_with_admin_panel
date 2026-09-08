import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section, SectionHeader, StatusPill } from "@/components/admin/ui";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { createUser, deleteUser } from "@/lib/actions/users";

export const metadata = { title: "Users" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const { session, permissions } = await requirePermission("users.view");
  const currentEmail = session?.user?.email;
  const canCreate = permissions.includes("users.create");
  const canDelete = permissions.includes("users.delete");

  const [users, roles] = await Promise.all([
    prisma.adminUser.findMany({ orderBy: { createdAt: "asc" }, include: { role: true } }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
  ]);

  const protectedRoleCounts = new Map<string, number>();
  for (const u of users) {
    if (u.role.isProtected) protectedRoleCounts.set(u.roleId, (protectedRoleCounts.get(u.roleId) ?? 0) + 1);
  }

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader title="Admin users" description="People who can sign in and manage the store." />

      <Section>
        <SectionHeader title="Your account" description="Change your own sign-in password." />
        <ChangePasswordForm />
      </Section>

      {canCreate && (
        <Section>
          <SectionHeader title="Add a user" />
          <form action={createUser} className="space-y-4 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" minLength={8} required />
                <p className="text-xs text-neutral-500">At least 8 characters.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="roleId">Role</Label>
                <select
                  id="roleId"
                  name="roleId"
                  defaultValue={roles.find((r) => !r.isProtected)?.id ?? roles[0]?.id}
                  className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit">
              <Plus className="h-4 w-4" /> Create user
            </Button>
          </form>
        </Section>
      )}

      <Section>
        <SectionHeader
          title="All users"
          description={`${users.length} total`}
        />
        <ul className="divide-y divide-neutral-100">
          {users.map((u) => {
            const isSelf = currentEmail === u.email;
            const isLastInProtectedRole = u.role.isProtected && (protectedRoleCounts.get(u.roleId) ?? 0) <= 1;
            const rowCanDelete = canDelete && !isSelf && !isLastInProtectedRole;
            return (
              <li key={u.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-700">
                    {u.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                  <div>
                    <p className="flex items-center gap-2 font-medium text-neutral-900">
                      {u.name}
                      {isSelf && <StatusPill tone="blue">You</StatusPill>}
                    </p>
                    <p className="text-sm text-neutral-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill tone={u.role.isProtected ? "purple" : "neutral"}>{u.role.name}</StatusPill>
                  {rowCanDelete ? (
                    <form action={deleteUser}>
                      <input type="hidden" name="id" value={u.id} />
                      <ConfirmSubmit message={`Remove ${u.name}'s access?`} variant="danger">
                        Delete
                      </ConfirmSubmit>
                    </form>
                  ) : canDelete ? (
                    <span
                      title={isSelf ? "You can't delete your own account" : "Can't delete the last user in a protected role"}
                      className="cursor-not-allowed px-3 py-1.5 text-sm font-medium text-neutral-300"
                    >
                      Delete
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
}
