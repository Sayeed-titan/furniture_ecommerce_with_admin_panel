import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/site/checkout/checkout-form";
import { isSslcommerzConfigured } from "@/lib/payment/sslcommerz";
import { getAllSettings, SETTING_KEYS, isEnabled } from "@/lib/settings";

export const metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
  const user = session?.user as { id?: string; userType?: string; email?: string } | undefined;
  const customerId = user?.userType === "customer" ? user.id : undefined;

  const [defaultAddress, shippingZones, settings] = await Promise.all([
    customerId
      ? prisma.address.findFirst({
          where: { customerId },
          orderBy: { isDefault: "desc" },
        })
      : Promise.resolve(null),
    prisma.shippingZone.findMany({ orderBy: [{ isDefault: "desc" }, { name: "asc" }] }),
    getAllSettings(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      <div className="mt-8">
        <CheckoutForm
          defaultAddress={defaultAddress}
          guestEmail={user?.email ?? null}
          codEnabled={isEnabled(settings[SETTING_KEYS.paymentCodEnabled])}
          onlinePaymentEnabled={
            isSslcommerzConfigured() && isEnabled(settings[SETTING_KEYS.paymentOnlineEnabled])
          }
          shippingZones={shippingZones.map((z) => ({ id: z.id, name: z.name, fee: z.fee.toString(), isDefault: z.isDefault }))}
        />
      </div>
    </div>
  );
}
