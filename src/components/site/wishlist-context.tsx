"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

const STORAGE_KEY = "president:wishlist";

type WishlistContextValue = {
  ids: string[];
  isWishlisted: (id: string) => boolean;
  toggle: (id: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const listeners = new Set<() => void>();

function readStoredIds(): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

let cachedIds: string[] = typeof window === "undefined" ? [] : readStoredIds();

function writeStoredIds(ids: string[]) {
  cachedIds = ids;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cachedIds;
}

const EMPTY_IDS: string[] = [];

function getServerSnapshot() {
  return EMPTY_IDS;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle(id: string) {
    const current = readStoredIds();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    writeStoredIds(next);
  }

  function clear() {
    writeStoredIds([]);
  }

  return (
    <WishlistContext.Provider
      value={{ ids, isWishlisted: (id) => ids.includes(id), toggle, clear }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
