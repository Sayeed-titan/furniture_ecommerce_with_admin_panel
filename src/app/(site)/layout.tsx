import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { WishlistProvider } from "@/components/site/wishlist-context";
import { CartProvider } from "@/components/site/cart-context";
import { LocaleProvider } from "@/components/site/locale/locale-context";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { getSetting, SETTING_KEYS } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const whatsapp = await getSetting(SETTING_KEYS.whatsappNumber);

  return (
    <LocaleProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="flex min-h-full flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            {whatsapp && <WhatsAppButton number={whatsapp} />}
          </div>
        </CartProvider>
      </WishlistProvider>
    </LocaleProvider>
  );
}
