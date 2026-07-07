"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/components/site/wishlist-context";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { ids } = useWishlist();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Woodcraft Furniture
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-600 sm:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-neutral-900">
              {link.label}
            </Link>
          ))}
          <Link href="/wishlist" className="relative flex items-center gap-1.5 hover:text-neutral-900">
            <Heart className="h-4 w-4" />
            Wishlist
            {ids.length > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-xs font-semibold text-white">
                {ids.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
