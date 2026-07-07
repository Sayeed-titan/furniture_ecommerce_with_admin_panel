import { cn } from "@/lib/utils";

/**
 * One scroll-snap stop. `scroll-mt-16` keeps the snapped position clear of
 * the sticky 64px header; `snap-start` opts this section into the
 * `snap-y snap-proximity` set globally on <html> (a no-op on every other
 * page, since nothing else defines snap-align children).
 */
export function Chapter({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-16 snap-start", className)}>
      {children}
    </section>
  );
}
