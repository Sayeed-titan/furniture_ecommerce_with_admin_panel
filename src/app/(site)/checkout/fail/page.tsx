import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Payment Not Completed" };

type SearchParams = Promise<{ order?: string; reason?: string }>;

const reasonCopy: Record<string, string> = {
  cancelled: "You cancelled the payment before it completed.",
  failed: "The payment didn't go through.",
  not_configured: "Online payment isn't available right now — please choose Cash on Delivery.",
  init_failed: "We couldn't start the payment session. Please try again.",
};

export default async function CheckoutFailPage({ searchParams }: { searchParams: SearchParams }) {
  const { order, reason } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6 lg:px-8">
      <XCircle className="mx-auto h-12 w-12 text-red-500" />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Payment not completed</h1>
      <p className="mt-2 text-neutral-600">
        {reasonCopy[reason ?? ""] ?? "Something went wrong with the payment."}
        {order && (
          <>
            {" "}
            Your order <strong>{order}</strong> was saved but hasn&apos;t been paid for yet.
          </>
        )}
      </p>
      <Button asChild className="mt-8">
        <Link href="/checkout">Try again</Link>
      </Button>
    </div>
  );
}
