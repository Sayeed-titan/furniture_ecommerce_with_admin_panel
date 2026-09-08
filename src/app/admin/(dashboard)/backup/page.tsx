import { Download, Trash2 } from "lucide-react";
import { requirePermission } from "@/lib/authz";
import { listBackups } from "@/lib/backup";
import { deleteBackupAction } from "@/lib/actions/backup";
import { PageHeader, Section, EmptyRow } from "@/components/admin/ui";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { CreateBackupButton } from "@/components/admin/create-backup-button";

export const metadata = { title: "Backup" };
export const dynamic = "force-dynamic";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminBackupPage() {
  const { permissions } = await requirePermission("backup.view");
  const canCreate = permissions.includes("backup.create");
  const canDelete = permissions.includes("backup.delete");

  const backups = await listBackups();

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        title="Backup"
        description="Full database snapshots, stored on this server and downloadable to your own computer. Restore isn't built yet — treat these as insurance, not a one-click undo."
      >
        {canCreate && <CreateBackupButton />}
      </PageHeader>

      <Section>
        {backups.length === 0 ? (
          <EmptyRow>No backups yet. Create the first one above.</EmptyRow>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {backups.map((b) => (
              <li key={b.name} className="flex items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="font-medium text-neutral-900">{b.name}</p>
                  <p className="text-sm text-neutral-500">
                    {b.createdAt.toLocaleString()} · {formatBytes(b.sizeBytes)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={`/api/admin/backups/${b.name}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                  {canDelete && (
                    <form action={deleteBackupAction}>
                      <input type="hidden" name="name" value={b.name} />
                      <ConfirmSubmit message={`Delete ${b.name}? This cannot be undone.`} variant="danger">
                        <Trash2 className="h-3.5 w-3.5" />
                      </ConfirmSubmit>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
