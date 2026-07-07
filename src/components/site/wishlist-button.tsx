"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/components/site/wishlist-context";
import { cn } from "@/lib/utils";

export function WishlistButton({ productId, className }: { productId: string; className?: string }) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(productId);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white/90 shadow-sm transition-colors hover:border-neutral-300",
        className
      )}
    >
      <Heart
        className={cn("h-4 w-4", active ? "fill-red-500 text-red-500" : "text-neutral-500")}
      />
    </button>
  );
}
