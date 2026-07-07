import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="bg-neutral-900">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="mt-2 max-w-xl text-neutral-300">
            Tell us what you need and our team will help you find or custom-build
            the right piece for your space.
          </p>
        </div>
        <Button asChild size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-neutral-900">
          <Link href="/contact">Talk to Us</Link>
        </Button>
      </div>
    </section>
  );
}
