"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n/dictionary";
import { locales } from "@/lib/i18n/dictionary";
import { notoSansBengali } from "@/lib/i18n/fonts";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "woodcraft:locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const listeners = new Set<() => void>();

function isLocale(value: string | null): value is Locale {
  return value !== null && (locales as string[]).includes(value);
}

function readStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : "en";
  } catch {
    return "en";
  }
}

let cachedLocale: Locale = typeof window === "undefined" ? "en" : readStoredLocale();

function writeStoredLocale(locale: Locale) {
  cachedLocale = locale;
  window.localStorage.setItem(STORAGE_KEY, locale);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cachedLocale;
}

function getServerSnapshot(): Locale {
  return "en";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keep <html lang> in sync, including on first hydration when the
  // persisted locale differs from the server-rendered default ("en").
  useEffect(() => {
    document.documentElement.lang = locale === "bn" ? "bn" : "en";
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale: writeStoredLocale }}>
      <div className={cn(locale === "bn" && notoSansBengali.className)}>{children}</div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
