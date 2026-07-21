import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/site/checkout/checkout-form";
import { isSslcommerzConfigured } from "@/lib/payment/sslcommerz";

export const metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
  const user = session?.user as { id?: string; userType?: string; email?: string } | undefined;
  const customerId = user?.userType === "customer" ? user.id : undefined;

  const defaultAddress = customerId
    ? await prisma.address.findFirst({
        where: { customerId },
        orderBy: { isDefault: "desc" },
      })
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      <div className="mt-8">
        <CheckoutForm
          defaultAddress={defaultAddress}
          guestEmail={user?.email ?? null}
          onlinePaymentEnabled={isSslcommerzConfigured()}
        />
      </div>
    </div>
  );
}
