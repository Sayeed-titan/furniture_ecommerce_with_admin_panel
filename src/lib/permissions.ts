/**
 * Single source of truth for admin RBAC: every module (an admin page/section)
 * and the actions that can be permitted on it. Drives the nav filter, the
 * role-editor checkbox grid, and every server-side `requirePermission` guard.
 * A permission key is `${module}.${action}`, e.g. "products.edit".
 */
export const PERMISSION_MODULES = [
  { key: "dashboard", label: "Dashboard", actions: ["view"] },
  { key: "insights", label: "Insights", actions: ["view"] },
  { key: "products", label: "Products", actions: ["view", "create", "edit", "delete"] },
  { key: "categories", label: "Categories", actions: ["view", "create", "edit", "delete"] },
  { key: "materials", label: "Materials", actions: ["view", "create", "edit", "delete"] },
  { key: "shipping", label: "Shipping", actions: ["view", "create", "edit", "delete"] },
  { key: "orders", label: "Orders", actions: ["view", "edit", "export"] },
  { key: "customers", label: "Customers", actions: ["view", "edit"] },
  { key: "leads", label: "Leads", actions: ["view", "edit", "delete", "export"] },
  { key: "issues", label: "Issues", actions: ["view", "edit", "delete"] },
  { key: "settings", label: "Settings", actions: ["view", "edit"] },
  { key: "users", label: "Users & Roles", actions: ["view", "create", "edit", "delete"] },
  { key: "backup", label: "Backup", actions: ["view", "create", "delete"] },
] as const;

export type ModuleKey = (typeof PERMISSION_MODULES)[number]["key"];

export const ALL_PERMISSIONS: string[] = PERMISSION_MODULES.flatMap((m) =>
  m.actions.map((a) => `${m.key}.${a}`)
);

const ALL_PERMISSIONS_SET = new Set(ALL_PERMISSIONS);

export function isValidPermission(value: unknown): value is string {
  return typeof value === "string" && ALL_PERMISSIONS_SET.has(value);
}

/** Filters an arbitrary array down to only recognized permission keys. */
export function sanitizePermissions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isValidPermission);
}

/** A role that can see and act on every module — used for the seeded Administrator role. */
export function allPermissions(): string[] {
  return [...ALL_PERMISSIONS];
}
