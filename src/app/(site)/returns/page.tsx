import { PolicyLayout, PolicySection } from "@/components/site/policy-layout";

export const metadata = { title: "Return & Refund Policy" };

export default function ReturnsPage() {
  return (
    <PolicyLayout title="Return & Refund Policy">
      <PolicySection heading="Damaged or defective items">
        <p>
          If a piece arrives damaged or with a manufacturing defect, contact us within 3 days of
          delivery with photos of the issue. We&apos;ll arrange a free repair, replacement, or refund —
          whichever is appropriate.
        </p>
      </PolicySection>

      <PolicySection heading="Change of mind">
        <p>
          Ready-made items in original, unused condition can be returned within 7 days of delivery.
          The customer covers return shipping unless the return is due to our error. Made-to-order
          and custom-built pieces are not eligible for change-of-mind returns, since they&apos;re built
          specifically for you.
        </p>
      </PolicySection>

      <PolicySection heading="How refunds work">
        <p>
          Approved refunds are issued to the original payment method (or, for Cash on Delivery
          orders, by bank transfer or mobile banking) within 7–10 working days of us receiving the
          returned item.
        </p>
      </PolicySection>

      <PolicySection heading="Starting a return">
        <p>
          Reach out through our <a href="/contact" className="underline">Contact page</a> or
          WhatsApp with your order number and the reason for the return, and we&apos;ll guide you
          through the next steps.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
