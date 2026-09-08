"use client";

import { THEME_STORAGE_KEY } from "./theme-store";

/**
 * Applies the stored theme to <html> before the first paint, so a dark-mode
 * visitor never sees a white flash while React hydrates. Kept tiny and
 * dependency-free because it runs render-blocking in <head>.
 *
 * The `type` swap follows Next's "preventing flash before hydration" guide:
 * React warns when a render produces a <script> tag, so the client render
 * emits an inert `text/plain` copy and `suppressHydrationWarning` accepts the
 * server's executable one that already ran. It has to be a Client Component
 * for that swap to happen — a Server Component's `text/javascript` would be
 * baked into the RSC payload and replayed verbatim on the client.
 */
const html = `(function(){try{var p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});var d=p==="dark"||(p!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export function ThemeScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
