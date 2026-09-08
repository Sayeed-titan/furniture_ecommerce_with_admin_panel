"use client";

import { useSyncExternalStore } from "react";

export const THEME_STORAGE_KEY = "president:theme";

/** "system" follows the OS; "light"/"dark" are explicit user choices. */
export type ThemePreference = "light" | "dark" | "system";

/** What is actually painted right now. */
export type ResolvedTheme = "light" | "dark";

const listeners = new Set<() => void>();

function isPreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function readStoredPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolve(preference: ThemePreference): ResolvedTheme {
  return preference === "system" ? systemTheme() : preference;
}

type Snapshot = { preference: ThemePreference; resolved: ResolvedTheme };

// The server can't know the visitor's preference, so it always renders the
// light snapshot; the inline script in the root layout has already put the
// right class on <html> by the time hydration runs, and `useSyncExternalStore`
// swaps in the real client snapshot without a hydration mismatch.
const SERVER_SNAPSHOT: Snapshot = { preference: "system", resolved: "light" };

let snapshot: Snapshot = SERVER_SNAPSHOT;

/** Mirror the resolved theme onto <html> — the single source of truth for CSS. */
function paint(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

function setSnapshot(preference: ThemePreference) {
  const resolved = resolve(preference);
  if (snapshot.preference === preference && snapshot.resolved === resolved) return;
  snapshot = { preference, resolved };
  paint(resolved);
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  snapshot = (() => {
    const preference = readStoredPreference();
    return { preference, resolved: resolve(preference) };
  })();

  // While the preference is "system", follow the OS live.
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (snapshot.preference === "system") setSnapshot("system");
    });

  // Another tab changing the preference should re-theme this one too.
  window.addEventListener("storage", (event) => {
    if (event.key === THEME_STORAGE_KEY) setSnapshot(readStoredPreference());
  });
}

export function setThemePreference(preference: ThemePreference) {
  try {
    if (preference === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Private-mode / blocked storage: still theme this page view.
  }
  setSnapshot(preference);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function useTheme() {
  const { preference, resolved } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { preference, resolved, setTheme: setThemePreference };
}
