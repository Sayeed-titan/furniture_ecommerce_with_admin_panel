import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import type { LandingProduct } from "@/components/site/landing/types";

const points = [
  "Solid wood, engineered wood, and full-grain leather — no shortcuts.",
  "Every piece checked for stability, joinery, and finish before it ships.",
  "Real stock levels shown up front, so you always know what's available.",
];

export function CraftSection({ product }: { product?: LandingProduct }) {
  const image = product?.images[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 lg:aspect-[5/4]">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product?.name ?? ""}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-100" />
          )}
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            Why people choose us
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Built to actually last in your home.
          </h2>
          <p className="mt-4 text-neutral-600">
            We&apos;re not a marketplace — every piece is sourced and finished by
            people who stand behind it. What you see is what you get, down to
            the material and the price.
          </p>
          <ul className="mt-6 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-neutral-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Check className="h-3 w-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
          >
            Have a question before you buy? Talk to us <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
