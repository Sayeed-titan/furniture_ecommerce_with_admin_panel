"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, DatabaseBackup } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBackupAction } from "@/lib/actions/backup";

export function CreateBackupButton() {
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      try {
        await createBackupAction();
        toast.success("Backup created.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Backup failed.");
      }
    });
  }

  return (
    <Button type="button" onClick={onClick} disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <DatabaseBackup className="h-4 w-4" />}
      {pending ? "Creating..." : "Create backup now"}
    </Button>
  );
}
