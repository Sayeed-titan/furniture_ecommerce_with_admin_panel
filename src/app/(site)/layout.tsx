import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { WishlistProvider } from "@/components/site/wishlist-context";
import { CartProvider } from "@/components/site/cart-context";
import { LocaleProvider } from "@/components/site/locale/locale-context";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { getAllSettings, SETTING_KEYS } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getAllSettings();
  const whatsapp = settings[SETTING_KEYS.whatsappNumber];

  return (
    <LocaleProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="flex min-h-full flex-col">
            <SiteHeader
              brandIconUrl={settings[SETTING_KEYS.brandIconUrl]}
              brandLogoUrl={settings[SETTING_KEYS.brandLogoUrl]}
            />
            <main className="flex-1">{children}</main>
            <SiteFooter
              shopAddress={settings[SETTING_KEYS.shopAddress]}
              googleMapsUrl={settings[SETTING_KEYS.googleMapsUrl]}
              facebookUrl={settings[SETTING_KEYS.facebookUrl]}
              instagramUrl={settings[SETTING_KEYS.instagramUrl]}
              youtubeUrl={settings[SETTING_KEYS.youtubeUrl]}
              tiktokUrl={settings[SETTING_KEYS.tiktokUrl]}
            />
            {whatsapp && <WhatsAppButton number={whatsapp} />}
          </div>
        </CartProvider>
      </WishlistProvider>
    </LocaleProvider>
  );
}
