import { requirePermission } from "@/lib/authz";
import { getSetting, SETTING_KEYS } from "@/lib/settings";
import {
  DEFAULT_TERMS_CONTENT,
  DEFAULT_DELIVERY_CONTENT,
  DEFAULT_RETURN_POLICY_CONTENT,
  DEFAULT_WARRANTY_CONTENT,
} from "@/lib/policy-content";
import { PageHeader, Section } from "@/components/admin/ui";
import { PolicyForm } from "@/components/admin/policy-form";

export const metadata = { title: "Policy Pages" };
export const dynamic = "force-dynamic";

export default async function AdminPoliciesPage() {
  await requirePermission("settings.edit");

  const [terms, delivery, returns, warranty] = await Promise.all([
    getSetting(SETTING_KEYS.termsContent),
    getSetting(SETTING_KEYS.deliveryContent),
    getSetting(SETTING_KEYS.returnPolicyContent),
    getSetting(SETTING_KEYS.warrantyContent),
  ]);

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        title="Policy pages"
        description="Terms, delivery, returns, and warranty content shown on the public site."
      />
      <Section className="p-5">
        <PolicyForm
          defaults={{
            terms: terms ?? DEFAULT_TERMS_CONTENT,
            delivery: delivery ?? DEFAULT_DELIVERY_CONTENT,
            returns: returns ?? DEFAULT_RETURN_POLICY_CONTENT,
            warranty: warranty ?? DEFAULT_WARRANTY_CONTENT,
          }}
        />
      </Section>
    </div>
  );
}
