import { LeadForm } from "@/components/site/lead-form";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Talk to Us</h1>
      <p className="mt-2 text-neutral-600">
        Tell us what you&apos;re looking for and our team will reach out to help
        you find the right piece.
      </p>
      <div className="mt-8">
        <LeadForm />
      </div>
    </div>
  );
}
