"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, X } from "lucide-react";
import { StatusPill } from "@/components/admin/ui";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { RolePermissionGrid } from "@/components/admin/role-permission-grid";
import { updateRole, deleteRole } from "@/lib/actions/roles";

export function RoleRow({
  id,
  name,
  isProtected,
  permissions,
  userCount,
}: {
  id: string;
  name: string;
  isProtected: boolean;
  permissions: string[];
  userCount: number;
}) {
  const [editing, setEditing] = useState(false);

  async function handleUpdate(formData: FormData) {
    setEditing(false);
    try {
      await updateRole(formData);
      toast.success("Role updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update the role.");
    }
  }

  return (
    <li className="px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="font-medium text-neutral-900">{name}</p>
          {isProtected && <StatusPill tone="purple">Protected</StatusPill>}
          <StatusPill tone="neutral">
            {userCount} user{userCount === 1 ? "" : "s"}
          </StatusPill>
        </div>
        {!isProtected && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
            >
              {editing ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
              {editing ? "Close" : "Edit"}
            </button>
            {userCount === 0 ? (
              <form action={deleteRole}>
                <input type="hidden" name="id" value={id} />
                <ConfirmSubmit message={`Delete role "${name}"?`} variant="danger">
                  Delete
                </ConfirmSubmit>
              </form>
            ) : (
              <span
                title="Reassign its users to another role first"
                className="cursor-not-allowed px-3 py-1.5 text-sm font-medium text-neutral-300"
              >
                Delete
              </span>
            )}
          </div>
        )}
      </div>

      {editing && !isProtected && (
        <form action={handleUpdate} className="mt-4 space-y-4">
          <input type="hidden" name="id" value={id} />
          <input
            name="name"
            defaultValue={name}
            required
            className="flex h-10 w-full max-w-xs rounded-md border border-neutral-300 bg-white px-3 text-sm"
          />
          <RolePermissionGrid defaultPermissions={permissions} />
          <button
            type="submit"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Save role
          </button>
        </form>
      )}

      {isProtected && (
        <p className="mt-2 text-xs text-neutral-400">
          Always has every permission. Can&apos;t be edited or deleted.
        </p>
      )}
    </li>
  );
}
