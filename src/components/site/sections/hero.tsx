import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.06),transparent_55%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium tracking-wide text-neutral-600">
          Solid Wood &middot; Artificial Wood &middot; Leather
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
          Furniture built to last, made for how you live.
        </h1>
        <p className="max-w-xl text-lg text-neutral-600">
          Handcrafted pieces for the home and office. Browse our catalog, save
          your favorites, and let our team bring them to life for you.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Talk to Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
