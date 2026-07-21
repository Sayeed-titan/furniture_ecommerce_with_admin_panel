import { PolicyLayout, PolicySection } from "@/components/site/policy-layout";

export const metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <PolicyLayout title="Frequently Asked Questions">
      <PolicySection heading="What materials do you use?">
        <p>
          We work in solid wood, engineered wood, artificial wood, leather, fabric, and metal —
          each product page lists its exact material so there are no surprises when it arrives.
        </p>
      </PolicySection>

      <PolicySection heading="Do you build custom furniture?">
        <p>
          Yes. Beyond the catalogue, we take on-site commissions — fitted wardrobes, permanent
          interiors, custom doors, and millwork — measured at your home or office and installed by
          the same team that made them. <a href="/contact" className="underline">Contact us</a> to
          start a commission.
        </p>
      </PolicySection>

      <PolicySection heading="How long does delivery take?">
        <p>
          Most ready-made pieces ship within a week; made-to-order and custom work takes longer.
          Each product page shows its own estimated delivery time — see our{" "}
          <a href="/delivery" className="underline">Delivery Information</a> page for details.
        </p>
      </PolicySection>

      <PolicySection heading="What payment methods do you accept?">
        <p>
          Cash on Delivery is available everywhere we deliver. Online payment (cards, mobile
          banking) is being rolled out — the checkout page always shows what&apos;s currently available.
        </p>
      </PolicySection>

      <PolicySection heading="Can I return or exchange a product?">
        <p>
          Yes, within the terms in our{" "}
          <a href="/returns" className="underline">Return &amp; Refund Policy</a>.
        </p>
      </PolicySection>

      <PolicySection heading="Do you offer a warranty?">
        <p>
          Yes — see our <a href="/warranty" className="underline">Warranty</a> page for what&apos;s
          covered and for how long.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
