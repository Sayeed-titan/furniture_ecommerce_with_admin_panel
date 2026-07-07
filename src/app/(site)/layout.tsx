import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { WishlistProvider } from "@/components/site/wishlist-context";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </WishlistProvider>
  );
}
