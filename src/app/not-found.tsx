import type { Metadata } from "next";
import Link from "next/link";
import { BrandLockup } from "@/components/site/brand/logo";
import { LocaleProvider } from "@/components/site/locale/locale-context";
import { LanguageSwitcher } from "@/components/site/locale/language-switcher";
import { NotFoundPanel } from "@/components/site/not-found-panel";
import { ThemeToggle } from "@/components/site/theme/theme-toggle";

export const metadata: Metadata = { title: "Page Not Found" };

/**
 * The app-wide 404 for URLs that match no route at all. It renders directly
 * inside the root layout, so it carries its own minimal chrome instead of the
 * site header — and reads nothing from the database, which keeps the error
 * page itself working even when the data layer is the thing that's broken.
 */
export default function NotFound() {
  return (
    <LocaleProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <header className="border-b border-neutral-200">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              aria-label="President Furniture — home"
              className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
            >
              <BrandLockup />
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1">
          <NotFoundPanel />
        </main>

        <footer className="border-t border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-neutral-500 sm:px-6 lg:px-8">
            &copy; {new Date().getFullYear()} President Furniture
          </div>
        </footer>
      </div>
    </LocaleProvider>
  );
}
