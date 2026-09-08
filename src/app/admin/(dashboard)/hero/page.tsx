import { requirePermission } from "@/lib/authz";
import { getAllSettings, SETTING_KEYS } from "@/lib/settings";
import { PageHeader, Section, SectionHeader } from "@/components/admin/ui";
import { HeroContentForm } from "@/components/admin/hero-content-form";
import { HeroSlideManager } from "@/components/admin/hero-slide-manager";

export const metadata = { title: "Hero Section" };
export const dynamic = "force-dynamic";

function parseSlides(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export default async function AdminHeroPage() {
  await requirePermission("settings.edit");
  const settings = await getAllSettings();
  const slides = parseSlides(settings[SETTING_KEYS.heroSlidesJson]);

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader
        title="Hero Section"
        description='Homepage banner text, buttons, and background photos — the "Commerce" landing design only.'
      />

      <Section className="p-5">
        <SectionHeader title="Text & buttons" />
        <div className="pt-4">
          <HeroContentForm
            eyebrow={settings[SETTING_KEYS.heroEyebrow] ?? ""}
            headline={settings[SETTING_KEYS.heroHeadline] ?? ""}
            subtitle={settings[SETTING_KEYS.heroSubtitle] ?? ""}
            primaryLabel={settings[SETTING_KEYS.heroPrimaryLabel] ?? ""}
            primaryHref={settings[SETTING_KEYS.heroPrimaryHref] ?? ""}
            secondaryLabel={settings[SETTING_KEYS.heroSecondaryLabel] ?? ""}
            secondaryHref={settings[SETTING_KEYS.heroSecondaryHref] ?? ""}
          />
        </div>
      </Section>

      <Section className="p-5">
        <SectionHeader title="Background photos" />
        <div className="pt-4">
          <HeroSlideManager slides={slides} />
        </div>
      </Section>
    </div>
  );
}
