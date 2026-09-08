"use server";

import { revalidatePath, refresh } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { getSetting, setSettings, SETTING_KEYS } from "@/lib/settings";

const MAX_SLIDES = 5;

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/hero");
  refresh();
}

async function getSlides(): Promise<string[]> {
  const raw = await getSetting(SETTING_KEYS.heroSlidesJson);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

async function saveSlides(slides: string[]) {
  await setSettings({ [SETTING_KEYS.heroSlidesJson]: JSON.stringify(slides) });
}

export type SaveHeroContentState = { ok?: boolean; error?: string };

export async function saveHeroContent(
  _prev: SaveHeroContentState,
  formData: FormData
): Promise<SaveHeroContentState> {
  await requirePermission("settings.edit");

  await setSettings({
    [SETTING_KEYS.heroEyebrow]: String(formData.get("heroEyebrow") ?? ""),
    [SETTING_KEYS.heroHeadline]: String(formData.get("heroHeadline") ?? ""),
    [SETTING_KEYS.heroSubtitle]: String(formData.get("heroSubtitle") ?? ""),
    [SETTING_KEYS.heroPrimaryLabel]: String(formData.get("heroPrimaryLabel") ?? ""),
    [SETTING_KEYS.heroPrimaryHref]: String(formData.get("heroPrimaryHref") ?? ""),
    [SETTING_KEYS.heroSecondaryLabel]: String(formData.get("heroSecondaryLabel") ?? ""),
    [SETTING_KEYS.heroSecondaryHref]: String(formData.get("heroSecondaryHref") ?? ""),
  });

  revalidate();
  return { ok: true };
}

/** Adds an already-uploaded hero image URL to the slide list (max 5). */
export async function addHeroSlide(url: string): Promise<{ error?: string }> {
  await requirePermission("settings.edit");
  if (!url) return {};

  const slides = await getSlides();
  if (slides.length >= MAX_SLIDES) {
    return { error: `You can have at most ${MAX_SLIDES} hero photos — remove one first.` };
  }
  await saveSlides([...slides, url]);
  revalidate();
  return {};
}

export async function removeHeroSlide(formData: FormData) {
  await requirePermission("settings.edit");
  const url = String(formData.get("url") ?? "");
  if (!url) return;

  const slides = await getSlides();
  await saveSlides(slides.filter((s) => s !== url));
  revalidate();
}

/** Move a slide up/down in the rotation order by swapping with its neighbour. */
export async function moveHeroSlide(formData: FormData) {
  await requirePermission("settings.edit");
  const url = String(formData.get("url") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!url) return;

  const slides = await getSlides();
  const index = slides.indexOf(url);
  if (index === -1) return;

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= slides.length) return;

  const next = [...slides];
  [next[index], next[swapWith]] = [next[swapWith], next[index]];
  await saveSlides(next);
  revalidate();
}
