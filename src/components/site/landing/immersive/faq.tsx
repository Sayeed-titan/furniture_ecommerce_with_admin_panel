"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/reveal";
import { fraunces } from "./fonts";

const FAQS = [
  {
    q: "Do you offer custom sizes or finishes?",
    a: "Yes — most pieces can be customized in size, wood tone, or upholstery. Mention it in your message when you contact us and we'll confirm options and pricing.",
  },
  {
    q: "How long does delivery take?",
    a: "In-stock pieces typically ship within 1–2 weeks. Made-to-order pieces vary — we'll give you an exact estimate before you commit to anything.",
  },
  {
    q: "What's the difference between solid wood and engineered wood?",
    a: "Solid wood is cut from a single piece of timber — durable and repairable over decades. Engineered wood uses layered or composite cores for stability and a lower price point without sacrificing everyday strength.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Every piece is covered by our workmanship guarantee against structural defects. Full details are confirmed when you place an order.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal>
        <h2 className={cn(fraunces.className, "text-3xl tracking-tight text-neutral-900 sm:text-4xl")}>
          Common Questions
        </h2>
      </Reveal>

      <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              >
                <span className="font-medium text-neutral-900">{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid overflow-hidden transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <p className="min-h-0 text-neutral-600">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
