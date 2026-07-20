"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import type { Product, ProductImage, Address } from "@prisma/client";
import { useCart } from "@/components/site/cart-context";
import { EmptyState } from "@/components/site/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { placeOrder, type PlaceOrderState } from "@/lib/actions/orders";

type ProductWithImages = Product & { images: ProductImage[] };

export function CheckoutForm({
  defaultAddress,
  guestEmail,
}: {
  defaultAddress: Address | null;
  guestEmail: string | null;
}) {
  const { items } = useCart();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [state, action, pending] = useActionState<PlaceOrderState, FormData>(placeOrder, {});

  const ids = items.map((item) => item.productId);

  useEffect(() => {
    if (ids.length === 0) return;
    fetch(`/api/products?ids=${ids.join(",")}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only when the set of ids changes
  }, [ids.join(",")]);

  const lines = items
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((line): line is { item: (typeof items)[number]; product: ProductWithImages } =>
      Boolean(line.product)
    );
  const subtotal = lines.reduce(
    (sum, { item, product }) => sum + Number(product.price) * item.qty,
    0
  );

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add items to your cart before checking out."
        action={
          <Button asChild size="sm" variant="outline">
            <Link href="/products">Browse Products</Link>
          </Button>
        }
      />
    );
  }

  return (
    <form action={action} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <input type="hidden" name="cartItems" value={JSON.stringify(items)} />

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-neutral-900">Shipping details</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="shipName">Full name</Label>
              <Input
                id="shipName"
                name="shipName"
                required
                defaultValue={defaultAddress?.recipientName}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipPhone">Phone</Label>
              <Input
                id="shipPhone"
                name="shipPhone"
                type="tel"
                required
                defaultValue={defaultAddress?.phone}
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="guestEmail">Email (optional)</Label>
              <Input
                id="guestEmail"
                name="guestEmail"
                type="email"
                defaultValue={guestEmail ?? undefined}
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="shipLine1">Address line 1</Label>
              <Input
                id="shipLine1"
                name="shipLine1"
                required
                defaultValue={defaultAddress?.line1}
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="shipLine2">Address line 2</Label>
              <Input id="shipLine2" name="shipLine2" defaultValue={defaultAddress?.line2 ?? undefined} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipCity">City</Label>
              <Input id="shipCity" name="shipCity" required defaultValue={defaultAddress?.city} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipArea">Area</Label>
              <Input id="shipArea" name="shipArea" defaultValue={defaultAddress?.area ?? undefined} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipPostCode">Post code</Label>
              <Input
                id="shipPostCode"
                name="shipPostCode"
                defaultValue={defaultAddress?.postCode ?? undefined}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-neutral-900">Payment method</h2>
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 text-sm has-[:checked]:border-neutral-900">
              <input type="radio" name="paymentMethod" value="COD" defaultChecked className="h-4 w-4" />
              <span>
                <span className="block font-medium text-neutral-900">Cash on Delivery</span>
                <span className="text-neutral-500">Pay when your order arrives.</span>
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 text-sm has-[:checked]:border-neutral-900">
              <input type="radio" name="paymentMethod" value="SSLCOMMERZ" className="h-4 w-4" />
              <span>
                <span className="block font-medium text-neutral-900">Pay Online</span>
                <span className="text-neutral-500">bKash, Nagad, cards &amp; mobile banking.</span>
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">Order notes (optional)</Label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          />
        </div>

        {state.error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}
      </div>

      <aside className="h-fit rounded-xl border border-neutral-200 p-6">
        <h2 className="font-semibold text-neutral-900">Order Summary</h2>
        <div className="mt-4 space-y-3">
          {lines.map(({ item, product }) => (
            <div key={product.id} className="flex justify-between text-sm">
              <span className="text-neutral-600">
                {product.name} × {item.qty}
              </span>
              <span className="text-neutral-900">
                {formatPrice(Number(product.price) * item.qty)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm font-semibold">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <Button type="submit" disabled={pending} className="mt-6 w-full">
          {pending ? "Placing order..." : "Place Order"}
        </Button>
      </aside>
    </form>
  );
}
