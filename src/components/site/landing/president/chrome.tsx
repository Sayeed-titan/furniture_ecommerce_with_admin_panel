"use client";

import Link from "next/link";
import { useTranslation, useDisplayFontClassName } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

/**
 * Tiny translated client leaves so the data-heavy sections (collection,
 * categories) can stay Server Components — only dictionary KEYS cross the
 * server/client boundary, never Prisma objects.
 */

export function Eyebrow({ k, className }: { k: string; className?: string }) {
  const { t } = useTranslation();
  return (
    <p
      className={cn(
        "flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.5em] text-[#b8925a]",
        className
      )}
    >
      <span aria-hidden="true" className="h-px w-12 bg-[#b8925a]/70" />
      {t(k)}
    </p>
  );
}

export function DisplayHeading({
  k,
  className,
  as: Tag = "h2",
}: {
  k: string;
  className?: string;
  as?: "h2" | "h3";
}) {
  const { t } = useTranslation();
  const displayFont = useDisplayFontClassName();
  return <Tag className={cn(displayFont, className)}>{t(k)}</Tag>;
}

export function TranslatedText({ k, className }: { k: string; className?: string }) {
  const { t } = useTranslation();
  return <span className={className}>{t(k)}</span>;
}

export function ArrowLink({ href, k, className }: { href: string; k: string; className?: string }) {
  const { t } = useTranslation();
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 text-sm font-medium tracking-wide text-[#d9b779] transition-colors hover:text-[#f4efe6]",
        className
      )}
    >
      {t(k)}
      <span
        aria-hidden="true"
        className="inline-block h-px w-8 bg-current transition-all duration-300 group-hover:w-12"
      />
    </Link>
  );
}
