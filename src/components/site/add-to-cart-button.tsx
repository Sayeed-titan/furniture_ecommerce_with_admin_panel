"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/site/cart-context";
import { useTranslation } from "@/lib/i18n/use-translation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddToCartModal } from "@/components/site/add-to-cart-modal";

export function AddToCartButton({
  productId,
  stockStatus,
  name,
  price,
  imageUrl,
  className,
}: {
  productId: string;
  stockStatus: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  className?: string;
}) {
  const { add } = useCart();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const outOfStock = stockStatus === "OUT_OF_STOCK";

  if (outOfStock) {
    return (
      <Button disabled size="lg" className={cn("w-full", className)}>
        {t("productCard.outOfStock")}
      </Button>
    );
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        className={cn("w-full", className)}
        onClick={() => {
          add(productId, 1);
          setShowModal(true);
        }}
      >
        <ShoppingCart className="h-4 w-4" /> {t("productCard.addToCart")}
      </Button>
      {showModal && (
        <AddToCartModal
          name={name}
          price={price}
          imageUrl={imageUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
