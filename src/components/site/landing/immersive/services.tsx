import Link from "next/link";
import { Armchair, PencilRuler, Hammer, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { fraunces } from "./fonts";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    icon: Armchair,
    title: "Ready to Take Home",
    body: "Browse finished pieces from our floor — sofas, beds, desks, and storage in solid wood, engineered wood, and leather, ready to deliver.",
    href: "/products",
    cta: "Browse the catalog",
  },
  {
    icon: PencilRuler,
    title: "Made to Order",
    body: "Love a design but need it different? We build to your dimensions, wood species, and finish — the same piece, sized for your space.",
    href: "/products",
    cta: "Explore the designs",
  },
  {
    icon: Hammer,
    title: "Built On-Site",
    body: "Our crew works at your home or office: fitted wardrobes and built-ins, permanent wood interiors, custom doors, and interior millwork.",
    href: "/contact",
    cta: "Book a consultation",
  },
] as const;

/**
 * "What We Do" — communicates the two sides of the business: buying
 * furniture off the floor, and commissioning custom woodwork installed
 * on-site at the customer's home or office.
 */
export function Services() {
  return (
    <section aria-labelledby="what-we-do" className="border-y border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            What We Do
          </p>
          <h2
            id="what-we-do"
            className={cn(
              fraunces.className,
              "mt-3 text-3xl tracking-tight text-neutral-900 sm:text-4xl"
            )}
          >
            Buy it finished, or have us build it{" "}
            <span className="italic text-neutral-500">where it lives.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            We&apos;re a workshop as much as a showroom — take a piece home today, or bring our
            builders to yours.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={i * 80}>
              <Link
                href={service.href}
                className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white transition-transform duration-300 group-hover:-rotate-6">
                  <service.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-neutral-900">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                  {service.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900">
                  {service.cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
