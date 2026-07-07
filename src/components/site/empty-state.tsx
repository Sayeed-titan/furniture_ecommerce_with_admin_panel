import { PackageSearch } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 py-16 text-center">
      <PackageSearch className="h-8 w-8 text-neutral-400" />
      <p className="font-medium text-neutral-900">{title}</p>
      {description && <p className="max-w-sm text-sm text-neutral-500">{description}</p>}
      {action}
    </div>
  );
}
