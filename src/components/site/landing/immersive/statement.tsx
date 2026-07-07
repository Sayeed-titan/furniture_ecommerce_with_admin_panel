import { Reveal } from "@/components/site/reveal";
import { fraunces } from "./fonts";
import { cn } from "@/lib/utils";

export function Statement() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <Reveal>
          <p
            className={cn(
              fraunces.className,
              "text-3xl leading-snug tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl"
            )}
          >
            Every piece is finished by hand
            <span className="italic text-neutral-500">, not by a machine.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
