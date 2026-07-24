"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";

export function SiteFooter() {
  const { t } = useTranslation();

  const shopLinks = [
    { href: "/products", label: t("nav.products") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const helpLinks = [
    { href: "/faq", label: t("footer.faq") },
    { href: "/returns", label: t("footer.returns") },
    { href: "/warranty", label: t("footer.warranty") },
    { href: "/delivery", label: t("footer.delivery") },
    { href: "/privacy", label: t("footer.privacy") },
  ];

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-2">
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-900">
            President Furniture
          </span>
          <p className="mt-2 max-w-xs text-sm text-neutral-500">
            Solid wood, leather &amp; artificial-wood furniture, and custom on-site woodwork — Dhaka, Bangladesh.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">
            {t("footer.shopHeading")}
          </p>
          <ul className="mt-3 space-y-2">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-neutral-600 hover:text-neutral-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">
            {t("footer.helpHeading")}
          </p>
          <ul className="mt-3 space-y-2">
            {helpLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-neutral-600 hover:text-neutral-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} President Furniture. {t("footer.rights")}
          </p>
          <Link href="/report" className="font-medium text-neutral-600 hover:text-neutral-900">
            {t("footer.reportIssue")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
