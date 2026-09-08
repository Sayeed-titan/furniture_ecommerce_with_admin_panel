import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number | string) {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Rounded discount percentage when compareAtPrice is a valid, higher price than price; otherwise null. */
export function discountPercent(
  price: number | string,
  compareAtPrice: number | string | null | undefined
): number | null {
  if (compareAtPrice == null || compareAtPrice === "") return null;
  const p = typeof price === "string" ? parseFloat(price) : price;
  const c = typeof compareAtPrice === "string" ? parseFloat(compareAtPrice) : compareAtPrice;
  if (!Number.isFinite(p) || !Number.isFinite(c) || c <= p || p < 0) return null;
  return Math.round(((c - p) / c) * 100);
}
