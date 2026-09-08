import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sanitizePermissions, allPermissions } from "@/lib/permissions";

/**
 * Per-request cached lookup of a role's permissions + protected flag. The
 * session/JWT only carries `roleId`, never this data itself, so a role
 * edit takes effect for every affected user on their very next request —
 * no re-login required.
 *
 * A protected role's permissions are always computed as the *current*
 * `allPermissions()` list, never read from its stored column. Otherwise
 * "Administrator always has every permission" would only be true at the
 * moment the role was first seeded — any permission module added to the
 * code later (a new admin section) would silently never reach an
 * already-migrated Administrator row, since nothing else re-syncs it and
 * the built-in role editor refuses to touch protected roles at all.
 */
export const getRoleInfo = cache(async (roleId: string): Promise<{ permissions: string[]; isProtected: boolean }> => {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    select: { permissions: true, isProtected: true },
  });
  if (!role) return { permissions: [], isProtected: false };
  return {
    permissions: role.isProtected ? allPermissions() : sanitizePermissions(role.permissions),
    isProtected: role.isProtected,
  };
});

export async function getRolePermissions(roleId: string): Promise<string[]> {
  return (await getRoleInfo(roleId)).permissions;
}

/**
 * True only for the built-in, protected Administrator role — used to gate
 * the few things that shouldn't be available to any custom role no matter
 * what permissions it's granted (e.g. the Active Design setting).
 */
export async function isProtectedRole(roleId: string): Promise<boolean> {
  return (await getRoleInfo(roleId)).isProtected;
}

export function hasPermission(permissions: string[], permission: string): boolean {
  return permissions.includes(permission);
}

/**
 * Loads the current admin session + its resolved permission set. Redirects
 * to /admin/login if there's no admin session at all. Use this once per page
 * (or in the dashboard layout) instead of calling `auth()` directly.
 */
export async function getAdminSession() {
  const session = await auth();
  const user = session?.user as
    | {
        id?: string;
        name?: string | null;
        email?: string | null;
        roleId?: string;
        roleName?: string;
        userType?: string;
      }
    | undefined;

  if (!session || user?.userType !== "admin" || !user.roleId) {
    redirect("/admin/login");
  }

  const permissions = await getRolePermissions(user.roleId);
  return { session, user, permissions };
}

/**
 * Guards a page or server action: redirects to login if unauthenticated, or
 * to the dashboard with a denial flag if the resolved role lacks the given
 * permission. Returns the session/user/permissions on success.
 */
export async function requirePermission(permission: string) {
  const { session, user, permissions } = await getAdminSession();
  if (!hasPermission(permissions, permission)) {
    // Never send them to /admin here — that page requires `dashboard.view`,
    // so a role lacking it would be redirected in a loop.
    redirect(`/admin/denied?p=${encodeURIComponent(permission)}`);
  }
  return { session, user, permissions };
}
