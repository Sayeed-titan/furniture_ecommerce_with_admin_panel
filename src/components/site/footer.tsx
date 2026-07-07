"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} Woodcraft Furniture. {t("footer.rights")}
        </p>
        <Link href="/report" className="font-medium text-neutral-600 hover:text-neutral-900">
          {t("footer.reportIssue")}
        </Link>
      </div>
    </footer>
  );
}
