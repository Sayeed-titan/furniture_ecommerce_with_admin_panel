import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PremiumCta() {
  return (
    <section className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Found something you love?
        </h2>
        <p className="mt-3 text-neutral-600">
          Save it to your wishlist and send it to us — we&apos;ll follow up with
          pricing, stock, and delivery details.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/wishlist">Open My Wishlist</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/products">Keep Browsing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
