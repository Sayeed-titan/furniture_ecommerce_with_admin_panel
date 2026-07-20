"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, ProductImage } from "@prisma/client";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/site/cart-context";
import { EmptyState } from "@/components/site/empty-state";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/use-translation";

type ProductWithImages = Product & { images: ProductImage[] };

export default function CartPage() {
  const { items, setQty, remove } = useCart();
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(items.length > 0);

  const ids = items.map((item) => item.productId);

  useEffect(() => {
    if (ids.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicking off a fetch is the standard use case for this effect
    setLoading(true);
    fetch(`/api/products?ids=${ids.join(",")}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only when the set of ids changes
  }, [ids.join(",")]);

  const lines = items
    .map((item) => ({
      item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((line): line is { item: (typeof items)[number]; product: ProductWithImages } =>
      Boolean(line.product)
    );

  const subtotal = lines.reduce(
    (sum, { item, product }) => sum + Number(product.price) * item.qty,
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">{t("cartPage.heading")}</h1>
      <p className="mt-2 text-neutral-600">{t("cartPage.subtitle")}</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {!loading && lines.length === 0 && (
            <EmptyState
              title={t("cartPage.emptyTitle")}
              description={t("cartPage.emptyDescription")}
              action={
                <Button asChild size="sm" variant="outline">
                  <Link href="/products">{t("cartPage.browseProducts")}</Link>
                </Button>
              }
            />
          )}

          {lines.map(({ item, product }) => {
            const image = product.images[0];
            const maxQty =
              product.stockStatus === "MADE_TO_ORDER" ? undefined : product.stockQty;
            return (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-xl border border-neutral-200 p-4"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100"
                >
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.alt ?? product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : null}
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-medium text-neutral-900 hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-neutral-500">
                    {formatPrice(product.price.toString())} {t("cartPage.each")}
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-neutral-200">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-50"
                    onClick={() => setQty(product.id, item.qty - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm tabular-nums">{item.qty}</span>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => setQty(product.id, item.qty + 1)}
                    disabled={maxQty !== undefined && item.qty >= maxQty}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <span className="w-24 shrink-0 text-right font-semibold text-neutral-900">
                  {formatPrice(Number(product.price) * item.qty)}
                </span>

                <button
                  type="button"
                  className="shrink-0 text-neutral-400 hover:text-neutral-700"
                  onClick={() => remove(product.id)}
                  aria-label={t("cartPage.remove")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {lines.length > 0 && (
          <aside className="h-fit rounded-xl border border-neutral-200 p-6">
            <h2 className="font-semibold text-neutral-900">{t("cartPage.summaryHeading")}</h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-neutral-600">{t("cartPage.subtotal")}</span>
              <span className="font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
            </div>
            <Button asChild className="mt-6 w-full">
              <Link href="/checkout">{t("cartPage.checkout")}</Link>
            </Button>
          </aside>
        )}
      </div>
    </div>
  );
}
