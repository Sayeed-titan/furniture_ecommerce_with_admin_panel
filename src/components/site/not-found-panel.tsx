"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThroneMark } from "@/components/site/brand/logo";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

/**
 * The 404 body, shared by the site, root, and admin not-found boundaries.
 *
 * Deliberately restrained: the throne mark in brass, a tracked kicker, and
 * the display serif — the same three notes the header wordmark plays — so a
 * dead URL still looks like President Furniture rather than a browser error.
 */
export function NotFoundPanel({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <section
      className={cn(
        "mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-28",
        className
      )}
    >
      {/* Brass on cream in light, brass on ink in dark — the mark keeps its
          metal in both themes, so it's pinned rather than themed. */}
      <span
        aria-hidden="true"
        className="text-[#8a6a3f] dark:text-[#d9b779]"
      >
        <ThroneMark className="h-11 w-11" strokeWidth={3} />
      </span>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a6a3f] dark:text-[#d9b779]">
        {t("notFound.eyebrow")}
      </p>

      <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl [font-family:var(--font-display),serif]">
        {t("notFound.title")}
      </h1>

      <span aria-hidden="true" className="mt-6 h-px w-16 bg-neutral-300" />

      <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-600">
        {t("notFound.body")}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">{t("notFound.home")}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/products" className="group">
            {t("notFound.products")}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </Button>
      </div>

      <p className="mt-8 text-sm text-neutral-500">
        {t("notFound.helpPrompt")}{" "}
        <Link
          href="/contact"
          className="font-medium text-neutral-900 underline underline-offset-4 hover:text-[#8a6a3f] dark:hover:text-[#d9b779]"
        >
          {t("notFound.help")}
        </Link>
      </p>
    </section>
  );
}
