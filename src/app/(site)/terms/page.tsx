import { PolicyLayout } from "@/components/site/policy-layout";
import { renderPolicyContent } from "@/lib/policy-markdown";
import { getSetting, SETTING_KEYS } from "@/lib/settings";
import { DEFAULT_TERMS_CONTENT } from "@/lib/policy-content";

export const metadata = { title: "Terms & Conditions" };
export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const content = (await getSetting(SETTING_KEYS.termsContent)) ?? DEFAULT_TERMS_CONTENT;

  return <PolicyLayout title="Terms & Conditions">{renderPolicyContent(content)}</PolicyLayout>;
}
