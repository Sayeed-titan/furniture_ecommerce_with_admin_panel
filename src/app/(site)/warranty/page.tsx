import { PolicyLayout, PolicySection } from "@/components/site/policy-layout";

export const metadata = { title: "Warranty" };

export default function WarrantyPage() {
  return (
    <PolicyLayout title="Warranty">
      <PolicySection heading="What's covered">
        <p>
          Every piece we sell carries a 1-year warranty against manufacturing defects — structural
          issues with the frame, joinery, or hardware that arise under normal household use.
        </p>
      </PolicySection>

      <PolicySection heading="What isn't covered">
        <p>
          Normal wear and tear, fabric or leather fading from direct sunlight, damage from moisture
          or pests, and damage from misuse, accidents, or unauthorized repairs aren&apos;t covered under
          warranty.
        </p>
      </PolicySection>

      <PolicySection heading="Making a claim">
        <p>
          Contact us with your order number, a description of the issue, and a few photos. If the
          claim is approved, we&apos;ll repair or replace the affected part at no cost — for custom and
          on-site work, our installation team handles the visit directly.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
