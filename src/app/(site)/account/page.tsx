import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AccountNav } from "@/components/site/account/account-nav";
import { AddressBook } from "@/components/site/account/address-book";

export const metadata = { title: "Your Account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  const customerId = (session?.user as { id?: string } | undefined)?.id;

  const customer = customerId
    ? await prisma.customer.findUnique({
        where: { id: customerId },
        include: { addresses: { orderBy: { isDefault: "desc" } } },
      })
    : null;

  if (!customer) return null; // proxy.ts already redirects unauthenticated visitors

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Your Account</h1>
      <AccountNav />

      <section>
        <h2 className="font-semibold text-neutral-900">Profile</h2>
        <div className="mt-3 rounded-xl border border-neutral-200 p-4 text-sm">
          <p className="text-neutral-900">{customer.name}</p>
          <p className="mt-1 text-neutral-600">{customer.email}</p>
          {customer.phone && <p className="text-neutral-600">{customer.phone}</p>}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-neutral-900">Saved addresses</h2>
        <div className="mt-3">
          <AddressBook addresses={customer.addresses} />
        </div>
      </section>
    </div>
  );
}
