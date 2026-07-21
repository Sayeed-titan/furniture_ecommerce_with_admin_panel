"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function AddToCartModal({
  name,
  price,
  imageUrl,
  onClose,
}: {
  name: string;
  price: number;
  imageUrl?: string | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("cartModal.heading")}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="font-semibold text-neutral-900">{t("cartModal.heading")}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("cartModal.close")}
            className="text-neutral-400 hover:text-neutral-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
            {imageUrl && <Image src={imageUrl} alt={name} fill className="object-cover" sizes="64px" />}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-neutral-900">{name}</p>
            <p className="text-sm text-neutral-500">{formatPrice(price)}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href="/cart">{t("cartModal.viewCart")}</Link>
          </Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            {t("cartModal.continueShopping")}
          </Button>
        </div>
      </div>
    </div>
  );
}
