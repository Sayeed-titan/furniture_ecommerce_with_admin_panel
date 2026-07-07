"use client";

import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

export function ScrollHint({ href }: { href: string }) {
  const { t } = useTranslation();

  return (
    <a
      href={href}
      aria-label={t("hero.scrollNext")}
      className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-safe:animate-bounce"
    >
      <ChevronDown className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
