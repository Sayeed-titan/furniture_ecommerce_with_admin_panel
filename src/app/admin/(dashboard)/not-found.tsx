import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThroneMark } from "@/components/site/brand/logo";

/**
 * Admin-side 404 — a record that was deleted, or an id that never existed.
 * Kept inside the dashboard shell so the sidebar stays available, and in
 * English only: the admin panel isn't localised.
 */
export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span aria-hidden="true" className="text-[#8a6a3f] dark:text-[#d9b779]">
        <ThroneMark className="h-9 w-9" strokeWidth={3} />
      </span>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a6a3f] dark:text-[#d9b779]">
        Error 404
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
        We couldn&apos;t find that record.
      </h1>
      <p className="mt-3 max-w-sm text-sm text-neutral-600">
        It may have been deleted, or the link points at an id that no longer
        exists.
      </p>
      <Link
        href="/admin"
        className="mt-7 inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to dashboard
      </Link>
    </div>
  );
}
