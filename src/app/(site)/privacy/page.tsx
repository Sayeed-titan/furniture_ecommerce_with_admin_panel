import { PolicyLayout, PolicySection } from "@/components/site/policy-layout";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <PolicySection heading="What we collect">
        <p>
          When you send an enquiry, create an account, or place an order, we collect your name,
          email, phone number, and delivery address — only what&apos;s needed to respond to you, process
          your order, and arrange delivery.
        </p>
      </PolicySection>

      <PolicySection heading="How we use it">
        <p>
          Your details are used to fulfill orders, respond to enquiries, and — only if you&apos;ve
          opted in — to follow up about products you&apos;ve shown interest in. We don&apos;t sell your
          information to third parties.
        </p>
      </PolicySection>

      <PolicySection heading="Who we share it with">
        <p>
          We share order details with our payment processor to complete payment, and use an email
          service to send order and enquiry notifications. These providers only receive what&apos;s
          necessary to do that job.
        </p>
      </PolicySection>

      <PolicySection heading="Your data, your control">
        <p>
          You can ask us to update or delete your account and order information at any time by
          contacting us. We keep order records as long as needed for accounting and warranty
          purposes.
        </p>
      </PolicySection>

      <PolicySection heading="Questions">
        <p>
          Reach out through our <a href="/contact" className="underline">Contact page</a> for any
          question about how your data is handled.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
