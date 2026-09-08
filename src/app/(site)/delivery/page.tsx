import { PolicyLayout } from "@/components/site/policy-layout";
import { renderPolicyContent } from "@/lib/policy-markdown";
import { getSetting, SETTING_KEYS } from "@/lib/settings";
import { DEFAULT_DELIVERY_CONTENT } from "@/lib/policy-content";

export const metadata = { title: "Delivery Information" };
export const dynamic = "force-dynamic";

export default async function DeliveryPage() {
  const content = (await getSetting(SETTING_KEYS.deliveryContent)) ?? DEFAULT_DELIVERY_CONTENT;

  return <PolicyLayout title="Delivery Information">{renderPolicyContent(content)}</PolicyLayout>;
}
