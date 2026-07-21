import { PolicyLayout, PolicySection } from "@/components/site/policy-layout";

export const metadata = { title: "Delivery Information" };

export default function DeliveryPage() {
  return (
    <PolicyLayout title="Delivery Information">
      <PolicySection heading="Delivery time">
        <p>
          Estimated delivery time is shown on every product page — it varies by piece, since some
          are kept in stock and others are made to order. As a rule of thumb, in-stock items reach
          Dhaka within a week and other divisions within 2 weeks; made-to-order pieces take longer.
        </p>
      </PolicySection>

      <PolicySection heading="Delivery areas">
        <p>
          We deliver nationwide across Bangladesh. Delivery charges and timelines outside Dhaka can
          vary by distance — the exact charge is confirmed at checkout or when we contact you to
          confirm the order.
        </p>
      </PolicySection>

      <PolicySection heading="Assembly & installation">
        <p>
          Ready-made furniture is delivered assembled or with our team assembling on-site, at no
          extra charge. Custom and on-site commissions (wardrobes, interiors, millwork) are
          installed directly by the team that measured and built them.
        </p>
      </PolicySection>

      <PolicySection heading="Cash on Delivery">
        <p>
          Cash on Delivery is available on every order, nationwide. You can also pay online at
          checkout where that option is shown.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
