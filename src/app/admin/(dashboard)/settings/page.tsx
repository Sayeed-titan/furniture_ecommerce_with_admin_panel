import { PageHeader, Section, SectionHeader } from "@/components/admin/ui";
import { requirePermission, isProtectedRole } from "@/lib/authz";
import { getAllSettings, SETTING_KEYS, isEnabled } from "@/lib/settings";
import { landingVariants, landingVariantLabels } from "@/components/site/landing/registry";
import { ACTIVE_LANDING_VARIANT } from "@/config/landing";
import { SettingsForm } from "@/components/admin/settings-form";
import { BrandAssetUploader } from "@/components/admin/brand-asset-uploader";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { user, permissions } = await requirePermission("settings.view");
  const canEdit = permissions.includes("settings.edit");
  // Active Design is Administrator-only — anyone else shouldn't see this
  // section at all, regardless of their settings.edit permission.
  const canSeeActiveDesign = !!user?.roleId && (await isProtectedRole(user.roleId));
  const settings = await getAllSettings();
  const currentVariant = settings[SETTING_KEYS.landingVariant] ?? ACTIVE_LANDING_VARIANT;

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader title="Settings" description="Control the public site without touching code." />

      {canEdit && (
        <Section className="p-5">
          <SectionHeader title="Branding" description="Uploaded here, shown everywhere the President Furniture mark appears." />
          <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2">
            <BrandAssetUploader
              kind="icon"
              label="Logo icon"
              description="Square mark used in compact spots (nav bar, sidebar). Falls back to the full logo, then the built-in mark, if not set."
              currentUrl={settings[SETTING_KEYS.brandIconUrl] ?? null}
            />
            <BrandAssetUploader
              kind="logo"
              label="Full logo"
              description="Wordmark/lockup image, shown wherever no icon is set."
              currentUrl={settings[SETTING_KEYS.brandLogoUrl] ?? null}
            />
          </div>
        </Section>
      )}

      <SettingsForm
        canEdit={canEdit}
        showActiveDesign={canSeeActiveDesign}
        currentVariant={currentVariant}
        variantOptions={(Object.keys(landingVariants) as (keyof typeof landingVariants)[]).map((key) => ({
          value: key,
          label: landingVariantLabels[key],
        }))}
        whatsappNumber={settings[SETTING_KEYS.whatsappNumber] ?? ""}
        businessPhone={settings[SETTING_KEYS.businessPhone] ?? ""}
        shopAddress={settings[SETTING_KEYS.shopAddress] ?? ""}
        googleMapsUrl={settings[SETTING_KEYS.googleMapsUrl] ?? ""}
        facebookUrl={settings[SETTING_KEYS.facebookUrl] ?? ""}
        instagramUrl={settings[SETTING_KEYS.instagramUrl] ?? ""}
        youtubeUrl={settings[SETTING_KEYS.youtubeUrl] ?? ""}
        tiktokUrl={settings[SETTING_KEYS.tiktokUrl] ?? ""}
        codEnabled={isEnabled(settings[SETTING_KEYS.paymentCodEnabled])}
        onlinePaymentEnabled={isEnabled(settings[SETTING_KEYS.paymentOnlineEnabled])}
      />
    </div>
  );
}
