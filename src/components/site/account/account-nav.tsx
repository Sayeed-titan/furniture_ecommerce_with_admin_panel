"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOutCustomer } from "@/lib/actions/customer-auth";

const links = [
  { href: "/account", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <div className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-4">
      <nav className="flex gap-6">
        {links.map((link) => {
          const active =
            link.href === "/account" ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium",
                active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <form action={signOutCustomer}>
        <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-900">
          Sign out
        </button>
      </form>
    </div>
  );
}
