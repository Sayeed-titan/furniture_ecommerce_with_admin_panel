import { PolicyLayout } from "@/components/site/policy-layout";
import { renderPolicyContent } from "@/lib/policy-markdown";
import { getSetting, SETTING_KEYS } from "@/lib/settings";
import { DEFAULT_RETURN_POLICY_CONTENT } from "@/lib/policy-content";

export const metadata = { title: "Return Policy" };
export const dynamic = "force-dynamic";

export default async function ReturnsPage() {
  const content = (await getSetting(SETTING_KEYS.returnPolicyContent)) ?? DEFAULT_RETURN_POLICY_CONTENT;

  return <PolicyLayout title="Return Policy">{renderPolicyContent(content)}</PolicyLayout>;
}
