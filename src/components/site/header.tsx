"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import { useWishlist } from "@/components/site/wishlist-context";
import { ThroneMark } from "@/components/site/brand/logo";
import { LanguageSwitcher } from "@/components/site/locale/language-switcher";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

/**
 * Site-wide header. Deliberately neutral (blacks/whites/grays) so it sits
 * comfortably above all four landing variants as well as the products,
 * wishlist, and contact pages.
 */
export function SiteHeader() {
  const { ids } = useWishlist();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/products", label: t("nav.products") },
    { href: "/contact", label: t("nav.contact") },
  ];

  // Close the mobile menu whenever the route changes (render-time state
  // adjustment, per https://react.dev/learn/you-might-not-need-an-effect).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const desktopLink = (href: string) =>
    cn(
      "relative py-1 text-sm font-medium transition-colors duration-200",
      "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-neutral-900 after:transition-transform after:duration-300 after:ease-out",
      "hover:after:scale-x-100 focus-visible:after:scale-x-100",
      "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900",
      isActive(href) ? "text-neutral-900 after:scale-x-100" : "text-neutral-600 hover:text-neutral-900"
    );

  const wishlistBadge = ids.length > 0 && (
    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-xs font-semibold tabular-nums text-white">
      {ids.length}
    </span>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/85 shadow-[0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Wordmark: monogram tile + stacked type lockup */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#171310] text-[#d9b779] shadow-sm ring-1 ring-neutral-900/10 transition-transform duration-300 ease-out group-hover:-rotate-6"
          >
            <ThroneMark className="h-6 w-6" />
          </span>
          <span className="flex flex-col justify-center leading-none">
            <span className="text-[17px] font-semibold tracking-[0.01em] text-neutral-900 [font-family:var(--font-display),serif]">
              President
            </span>
            <span className="mt-0.5 text-[8.5px] font-medium uppercase tracking-[0.42em] text-neutral-500 transition-colors duration-200 group-hover:text-[#8a6a3f]">
              Furniture
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={desktopLink(link.href)}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/wishlist"
            className={cn(desktopLink("/wishlist"), "flex items-center gap-1.5")}
            aria-current={isActive("/wishlist") ? "page" : undefined}
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
            {t("nav.wishlist")}
            {wishlistBadge}
          </Link>
          <LanguageSwitcher />
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="relative -mr-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? t("nav.closeMenu") : t("nav.openMenu")}</span>
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            {!open && ids.length > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-neutral-900"
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel: animated slide-down via the grid-rows trick.
          `invisible` when closed keeps hidden links out of the tab order. */}
      <div
        id="mobile-nav"
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-300 ease-out sm:hidden",
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <nav aria-label="Main" className="border-t border-neutral-200/80 px-4 pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "flex items-center rounded-lg px-3 py-3 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-neutral-900",
                  isActive(link.href)
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              aria-current={isActive("/wishlist") ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-neutral-900",
                isActive("/wishlist")
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              {t("nav.wishlist")}
              {wishlistBadge}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
