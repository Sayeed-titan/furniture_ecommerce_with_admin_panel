"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section, SectionHeader } from "@/components/admin/ui";
import { saveSettings, type SaveSettingsState } from "@/lib/actions/settings";

export function SettingsForm({
  canEdit,
  showActiveDesign,
  currentVariant,
  variantOptions,
  whatsappNumber,
  businessPhone,
  shopAddress,
  googleMapsUrl,
  facebookUrl,
  instagramUrl,
  youtubeUrl,
  tiktokUrl,
  codEnabled,
  onlinePaymentEnabled,
}: {
  canEdit: boolean;
  /** Active Design is Administrator-only — everyone else shouldn't see this
   *  section at all, regardless of settings.edit. */
  showActiveDesign: boolean;
  currentVariant: string;
  variantOptions: { value: string; label: string }[];
  whatsappNumber: string;
  businessPhone: string;
  shopAddress: string;
  googleMapsUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  codEnabled: boolean;
  onlinePaymentEnabled: boolean;
}) {
  const initialState: SaveSettingsState = {};
  const [state, formAction, isPending] = useActionState(saveSettings, initialState);

  useEffect(() => {
    if (state.ok) toast.success("Settings saved.");
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      {showActiveDesign ? (
        <Section>
          <SectionHeader title="Landing page" description="Choose which homepage design visitors see." />
          <div className="space-y-1.5 p-5">
            <Label htmlFor="landingVariant">Active design</Label>
            <select
              key={currentVariant}
              id="landingVariant"
              name="landingVariant"
              defaultValue={currentVariant}
              disabled={!canEdit}
              className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-400"
            >
              {variantOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-neutral-500">Changes go live immediately after saving.</p>
          </div>
        </Section>
      ) : (
        // Not shown to this role, but still round-tripped unchanged so
        // saving the rest of this form can't accidentally reset it.
        <input type="hidden" name="landingVariant" value={currentVariant} />
      )}

      <Section>
        <SectionHeader title="Contact" description="Shown on the site so customers can reach you fast." />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="whatsappNumber">WhatsApp number</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              placeholder="+8801XXXXXXXXX"
              defaultValue={whatsappNumber}
              disabled={!canEdit}
            />
            <p className="text-xs text-neutral-500">Adds a floating &ldquo;Chat on WhatsApp&rdquo; button. Leave blank to hide it.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="businessPhone">Phone number</Label>
            <Input
              id="businessPhone"
              name="businessPhone"
              placeholder="+8801XXXXXXXXX"
              defaultValue={businessPhone}
              disabled={!canEdit}
            />
            <p className="text-xs text-neutral-500">Used for the call button.</p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title="Footer" description="Shop address, map link, and social media — shown in the site footer." />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="shopAddress">Shop address</Label>
            <Input
              id="shopAddress"
              name="shopAddress"
              placeholder="Shop no B-27, 1st Floor, China City Dhaka Furniture Market, Progoti Sarani, Dhaka"
              defaultValue={shopAddress}
              disabled={!canEdit}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="googleMapsUrl">Google Maps link</Label>
            <Input
              id="googleMapsUrl"
              name="googleMapsUrl"
              placeholder="https://maps.google.com/..."
              defaultValue={googleMapsUrl}
              disabled={!canEdit}
            />
            <p className="text-xs text-neutral-500">
              Paste the &ldquo;Share&rdquo; link from Google Maps. Leave blank to hide the map link.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="facebookUrl">Facebook</Label>
            <Input
              id="facebookUrl"
              name="facebookUrl"
              placeholder="https://facebook.com/..."
              defaultValue={facebookUrl}
              disabled={!canEdit}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="instagramUrl">Instagram</Label>
            <Input
              id="instagramUrl"
              name="instagramUrl"
              placeholder="https://instagram.com/..."
              defaultValue={instagramUrl}
              disabled={!canEdit}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="youtubeUrl">YouTube</Label>
            <Input
              id="youtubeUrl"
              name="youtubeUrl"
              placeholder="https://youtube.com/..."
              defaultValue={youtubeUrl}
              disabled={!canEdit}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tiktokUrl">TikTok</Label>
            <Input
              id="tiktokUrl"
              name="tiktokUrl"
              placeholder="https://tiktok.com/@..."
              defaultValue={tiktokUrl}
              disabled={!canEdit}
            />
          </div>
          <p className="text-xs text-neutral-500 sm:col-span-2">Leave any of these blank to hide that link.</p>
        </div>
      </Section>

      <Section>
        <SectionHeader title="Payment methods" description="Which options customers see at checkout." />
        <div className="space-y-3 p-5">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="paymentCodEnabled"
              defaultChecked={codEnabled}
              disabled={!canEdit}
              className="h-4 w-4 rounded border-neutral-300"
            />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="paymentOnlineEnabled"
              defaultChecked={onlinePaymentEnabled}
              disabled={!canEdit}
              className="h-4 w-4 rounded border-neutral-300"
            />
            Online Payment (cards, bKash, Nagad, mobile banking via SSLCommerz)
          </label>
          <p className="text-xs text-neutral-500">
            Online Payment also needs SSLCommerz configured on the server to actually appear — this
            toggle only turns it off/on when that&apos;s already set up.
          </p>
        </div>
      </Section>

      {canEdit && (
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            <Save className="h-4 w-4" /> {isPending ? "Saving..." : "Save settings"}
          </Button>
        </div>
      )}
    </form>
  );
}
