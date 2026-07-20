"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/components/site/cart-context";
import { useTranslation } from "@/lib/i18n/use-translation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  productId,
  stockStatus,
  className,
}: {
  productId: string;
  stockStatus: string;
  className?: string;
}) {
  const { add } = useCart();
  const { t } = useTranslation();
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = stockStatus === "OUT_OF_STOCK";

  if (outOfStock) {
    return (
      <Button disabled size="lg" className={cn("w-full", className)}>
        {t("productCard.outOfStock")}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="lg"
      className={cn("w-full", className)}
      onClick={() => {
        add(productId, 1);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1500);
      }}
    >
      {justAdded ? (
        <>
          <Check className="h-4 w-4" /> {t("productCard.addedToCart")}
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" /> {t("productCard.addToCart")}
        </>
      )}
    </Button>
  );
}
