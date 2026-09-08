import type { Metadata } from "next";
import { NotFoundPanel } from "@/components/site/not-found-panel";

export const metadata: Metadata = { title: "Page Not Found" };

/**
 * Catches `notFound()` from inside the storefront (a dead product slug, an
 * order number that isn't the signed-in customer's) so the visitor keeps the
 * full header, nav, and footer to recover with.
 */
export default function SiteNotFound() {
  return <NotFoundPanel />;
}
