import { PolicyLayout } from "@/components/site/policy-layout";
import { renderPolicyContent } from "@/lib/policy-markdown";
import { getSetting, SETTING_KEYS } from "@/lib/settings";
import { DEFAULT_WARRANTY_CONTENT } from "@/lib/policy-content";

export const metadata = { title: "Warranty" };
export const dynamic = "force-dynamic";

export default async function WarrantyPage() {
  const content = (await getSetting(SETTING_KEYS.warrantyContent)) ?? DEFAULT_WARRANTY_CONTENT;

  return <PolicyLayout title="Warranty">{renderPolicyContent(content)}</PolicyLayout>;
}
