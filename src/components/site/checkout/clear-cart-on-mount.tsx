"use client";

import { useEffect } from "react";
import { useCart } from "@/components/site/cart-context";

/** Empties the cart once, after an order has successfully been placed. */
export function ClearCartOnMount() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run exactly once on mount
  }, []);

  return null;
}
