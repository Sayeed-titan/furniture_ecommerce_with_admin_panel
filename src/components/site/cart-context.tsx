"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

const STORAGE_KEY = "president:cart";

export type CartItem = { productId: string; qty: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  getQty: (productId: string) => number;
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const listeners = new Set<() => void>();

function readStoredItems(): CartItem[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

let cachedItems: CartItem[] = typeof window === "undefined" ? [] : readStoredItems();

function writeStoredItems(items: CartItem[]) {
  cachedItems = items;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cachedItems;
}

const EMPTY_ITEMS: CartItem[] = [];

function getServerSnapshot() {
  return EMPTY_ITEMS;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function add(productId: string, qty = 1) {
    const current = readStoredItems();
    const existing = current.find((item) => item.productId === productId);
    const next = existing
      ? current.map((item) =>
          item.productId === productId ? { ...item, qty: item.qty + qty } : item,
        )
      : [...current, { productId, qty }];
    writeStoredItems(next);
  }

  function setQty(productId: string, qty: number) {
    const current = readStoredItems();
    if (qty <= 0) {
      writeStoredItems(current.filter((item) => item.productId !== productId));
      return;
    }
    const next = current.some((item) => item.productId === productId)
      ? current.map((item) => (item.productId === productId ? { ...item, qty } : item))
      : [...current, { productId, qty }];
    writeStoredItems(next);
  }

  function remove(productId: string) {
    writeStoredItems(readStoredItems().filter((item) => item.productId !== productId));
  }

  function clear() {
    writeStoredItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        count: items.reduce((sum, item) => sum + item.qty, 0),
        getQty: (productId) => items.find((item) => item.productId === productId)?.qty ?? 0,
        add,
        setQty,
        remove,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
