import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section, SectionHeader } from "@/components/admin/ui";
import { getAllSettings, SETTING_KEYS } from "@/lib/settings";
import { landingVariants, landingVariantLabels } from "@/components/site/landing/registry";
import { ACTIVE_LANDING_VARIANT } from "@/config/landing";
import { saveSettings } from "@/lib/actions/settings";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAllSettings();
  const currentVariant = settings[SETTING_KEYS.landingVariant] ?? ACTIVE_LANDING_VARIANT;

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader title="Settings" description="Control the public site without touching code." />

      <form action={saveSettings} className="space-y-5">
        <Section>
          <SectionHeader title="Landing page" description="Choose which homepage design visitors see." />
          <div className="space-y-1.5 p-5">
            <Label htmlFor="landingVariant">Active design</Label>
            <select
              id="landingVariant"
              name="landingVariant"
              defaultValue={currentVariant}
              className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              {(Object.keys(landingVariants) as (keyof typeof landingVariants)[]).map((key) => (
                <option key={key} value={key}>
                  {landingVariantLabels[key]}
                </option>
              ))}
            </select>
            <p className="text-xs text-neutral-500">Changes go live immediately after saving.</p>
          </div>
        </Section>

        <Section>
          <SectionHeader title="Contact" description="Shown on the site so customers can reach you fast." />
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="whatsappNumber">WhatsApp number</Label>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                placeholder="+8801XXXXXXXXX"
                defaultValue={settings[SETTING_KEYS.whatsappNumber] ?? ""}
              />
              <p className="text-xs text-neutral-500">Adds a floating &ldquo;Chat on WhatsApp&rdquo; button. Leave blank to hide it.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="businessPhone">Phone number</Label>
              <Input
                id="businessPhone"
                name="businessPhone"
                placeholder="+8801XXXXXXXXX"
                defaultValue={settings[SETTING_KEYS.businessPhone] ?? ""}
              />
              <p className="text-xs text-neutral-500">Used for the call button.</p>
            </div>
          </div>
        </Section>

        <div className="flex justify-end">
          <Button type="submit">
            <Save className="h-4 w-4" /> Save settings
          </Button>
        </div>
      </form>
    </div>
  );
}
