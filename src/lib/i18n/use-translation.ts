"use client";

import { useLocale } from "@/components/site/locale/locale-context";
import { dictionaries } from "./dictionary";
import { fraunces } from "@/components/site/landing/immersive/fonts";
import { notoSerifBengali } from "./fonts";

type Dictionary = (typeof dictionaries)["en"];

function get(dict: Dictionary, path: string): string | undefined {
  return path.split(".").reduce<unknown>((node, key) => {
    if (node && typeof node === "object" && key in node) {
      return (node as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict) as string | undefined;
}

/** Looks up a dot-path string in the current locale's dictionary, falling back to English. */
export function useTranslation() {
  const { locale } = useLocale();

  function t(key: string): string {
    return get(dictionaries[locale], key) ?? get(dictionaries.en, key) ?? key;
  }

  return { t, locale };
}

/** Display-font className for big statement headings — Fraunces (en) or Noto Serif Bengali (bn). */
export function useDisplayFontClassName() {
  const { locale } = useLocale();
  return locale === "bn" ? notoSerifBengali.className : fraunces.className;
}
