import Link from "next/link";
import { ArrowLeft, ShieldOff } from "lucide-react";
import { getAdminSession } from "@/lib/authz";

/**
 * Landing page for a failed permission check. Deliberately gated on session
 * only (never `requirePermission`) — it's where denied users are sent, so
 * requiring a permission here would bounce them straight back into a loop.
 */
export default async function AdminDeniedPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { user } = await getAdminSession();
  const { p } = await searchParams;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span aria-hidden="true" className="text-[#8a6a3f] dark:text-[#d9b779]">
        <ShieldOff className="h-9 w-9" strokeWidth={2} />
      </span>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a6a3f] dark:text-[#d9b779]">
        Access denied
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
        You don&apos;t have permission for that page.
      </h1>
      <p className="mt-3 max-w-sm text-sm text-neutral-600">
        Your role{user.roleName ? ` (${user.roleName})` : ""} doesn&apos;t include
        {p ? ` the "${p}" permission` : " that permission"}. Ask an administrator
        to grant it from Roles.
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
