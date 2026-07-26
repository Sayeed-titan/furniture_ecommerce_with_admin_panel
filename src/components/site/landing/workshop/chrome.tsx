"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useLocale } from "@/components/site/locale/locale-context";
import { notoSerifBengali } from "@/lib/i18n/fonts";
import { newsreader } from "./fonts";
import { cn } from "@/lib/utils";

/**
 * Small translated client leaves so the data-heavy sections (rooms,
 * collection) can stay Server Components — only dictionary KEYS cross the
 * server/client boundary here, never Prisma objects (which carry Decimal
 * price fields that can't be serialized to a Client Component).
 */

/** Display serif className, locale-aware: Newsreader (en) / Noto Serif Bengali (bn). */
export function useWorkshopDisplayFont() {
  const { locale } = useLocale();
  return locale === "bn" ? notoSerifBengali.className : newsreader.className;
}

/** Mono, letter-spaced, numbered eyebrow — the catalogue index voice. */
export function Eyebrow({
  k,
  index,
  className,
  tone = "ink",
}: {
  k: string;
  index?: string;
  className?: string;
  tone?: "ink" | "brass";
}) {
  const { t } = useTranslation();
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em]",
        tone === "brass" ? "text-[#d9b779]" : "text-[#9a6a3c]",
        className
      )}
    >
      {index && <span aria-hidden="true">{index}</span>}
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
      {t(k)}
    </p>
  );
}

/** Big statement heading in the display serif. */
export function DisplayHeading({
  k,
  className,
  as: Tag = "h2",
}: {
  k: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const { t } = useTranslation();
  const font = useWorkshopDisplayFont();
  return <Tag className={cn(font, "text-balance", className)}>{t(k)}</Tag>;
}

/** Plain translated inline text (spans a key through the boundary). */
export function TranslatedText({ k, className }: { k: string; className?: string }) {
  const { t } = useTranslation();
  return <span className={className}>{t(k)}</span>;
}

/** Underlined "read more" link that grows its rule on hover. */
export function ArrowLink({
  href,
  k,
  className,
  tone = "ink",
}: {
  href: string;
  k: string;
  className?: string;
  tone?: "ink" | "cream";
}) {
  const { t } = useTranslation();
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 self-start border-b pb-1 text-[13px] tracking-[0.02em] transition-colors",
        tone === "cream"
          ? "border-[#f6f1e9]/40 text-[#f6f1e9] hover:border-[#d9b779] hover:text-[#d9b779]"
          : "border-[#17140f] text-[#17140f] hover:border-[#9a6a3c] hover:text-[#9a6a3c]",
        className
      )}
    >
      {t(k)}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        &rarr;
      </span>
    </Link>
  );
}
