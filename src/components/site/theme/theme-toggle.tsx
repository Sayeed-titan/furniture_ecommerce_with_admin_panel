"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-store";
import { cn } from "@/lib/utils";

/**
 * Light/dark switch. A visitor who has never chosen sits on "system"; the
 * first flip pins an explicit preference, which then wins over the OS.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolved, setTheme } = useTheme();
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-neutral-300 bg-neutral-100 transition-colors",
        "hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        className
      )}
    >
      {/* Both icons stay mounted so the knob slides over a fixed track. */}
      <Sun
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1.5 h-3.5 w-3.5 transition-opacity",
          isDark ? "opacity-40 text-neutral-500" : "opacity-0"
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-1.5 h-3.5 w-3.5 transition-opacity",
          isDark ? "opacity-0" : "opacity-40 text-neutral-500"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white shadow-sm transition-transform duration-300 ease-out",
          isDark ? "translate-x-6" : "translate-x-1"
        )}
      >
        {isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
      </span>
    </button>
  );
}
