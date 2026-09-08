"use client";

import { PERMISSION_MODULES } from "@/lib/permissions";

/** Checkbox grid grouped by module, used by both the create and edit role forms. */
export function RolePermissionGrid({
  defaultPermissions = [],
  disabled = false,
}: {
  defaultPermissions?: string[];
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {PERMISSION_MODULES.map((mod) => (
        <div key={mod.key} className="rounded-md border border-neutral-200 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {mod.label}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {mod.actions.map((action) => {
              const key = `${mod.key}.${action}`;
              return (
                <label key={key} className="flex items-center gap-1.5 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    name="permissions"
                    value={key}
                    disabled={disabled}
                    defaultChecked={defaultPermissions.includes(key)}
                    className="h-3.5 w-3.5 rounded border-neutral-300"
                  />
                  {action}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
