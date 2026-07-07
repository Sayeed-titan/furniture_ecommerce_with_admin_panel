"use client";

import { useLocale } from "@/components/site/locale/locale-context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-full border border-neutral-300 p-0.5 text-xs font-medium",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "en" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("bn")}
        aria-pressed={locale === "bn"}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "bn" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"
        )}
      >
        বাং
      </button>
    </div>
  );
}
