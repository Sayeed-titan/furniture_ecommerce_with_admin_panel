"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Tags,
  Inbox,
  Bug,
  Users,
  Settings,
  Menu,
  X,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { signOutAdmin } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

type NavGroup = {
  label: string;
  links: { href: string; label: string; icon: typeof LayoutDashboard }[];
};

const NAV: NavGroup[] = [
  {
    label: "Overview",
    links: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/insights", label: "Insights", icon: BarChart3 },
    ],
  },
  {
    label: "Catalog",
    links: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: Tags },
    ],
  },
  {
    label: "Inbox",
    links: [
      { href: "/admin/leads", label: "Leads", icon: Inbox },
      { href: "/admin/issues", label: "Issues", icon: Bug },
    ],
  },
  {
    label: "Configure",
    links: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/users", label: "Users", icon: Users },
    ],
  },
];

export function AdminShell({
  userName,
  userEmail,
  role,
  children,
}: {
  userName?: string | null;
  userEmail?: string | null;
  role?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer on route change.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const initials = (userName ?? "A")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-neutral-200 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 font-serif text-[15px] font-medium leading-none text-white">
          W
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight text-neutral-900">Woodcraft</span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
            Admin
          </span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.links.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-200 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        >
          <ExternalLink className="h-4 w-4" />
          View site
        </Link>
        <form action={signOutAdmin}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-neutral-200 bg-white lg:block">
        <div className="sticky top-0 h-screen">{sidebar}</div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-neutral-900/40 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebar}
        </aside>
      </div>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-medium text-neutral-900">{userName}</p>
              <p className="text-xs text-neutral-500">
                {userEmail} {role ? `· ${role}` : ""}
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
              {initials}
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      {open && <MobileClose onClose={() => setOpen(false)} />}
    </div>
  );
}

/** Floating close button while the mobile drawer is open. */
function MobileClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close menu"
      className="fixed left-[16.5rem] top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-700 shadow lg:hidden"
    >
      <X className="h-5 w-5" />
    </button>
  );
}
