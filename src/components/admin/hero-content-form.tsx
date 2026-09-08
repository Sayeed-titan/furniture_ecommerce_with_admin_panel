"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveHeroContent, type SaveHeroContentState } from "@/lib/actions/hero";

export function HeroContentForm({
  eyebrow,
  headline,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  eyebrow: string;
  headline: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}) {
  const initialState: SaveHeroContentState = {};
  const [state, formAction, isPending] = useActionState(saveHeroContent, initialState);

  useEffect(() => {
    if (state.ok) toast.success("Hero section updated.");
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <p className="rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
        Leave any field blank to use its default text. These apply to the homepage&apos;s
        &ldquo;Commerce&rdquo; hero banner only.
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="heroEyebrow">Eyebrow (small text above the headline)</Label>
        <Input id="heroEyebrow" name="heroEyebrow" placeholder="Office · Industrial" defaultValue={eyebrow} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="heroHeadline">Headline</Label>
        <Input id="heroHeadline" name="heroHeadline" placeholder="Furniture that gets to work." defaultValue={headline} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="heroSubtitle">Subtitle</Label>
        <textarea
          id="heroSubtitle"
          name="heroSubtitle"
          rows={3}
          defaultValue={subtitle}
          className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="heroPrimaryLabel">Primary button text</Label>
          <Input id="heroPrimaryLabel" name="heroPrimaryLabel" placeholder="Shop the catalogue" defaultValue={primaryLabel} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="heroPrimaryHref">Primary button link</Label>
          <Input id="heroPrimaryHref" name="heroPrimaryHref" placeholder="/products" defaultValue={primaryHref} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="heroSecondaryLabel">Secondary button text</Label>
          <Input id="heroSecondaryLabel" name="heroSecondaryLabel" placeholder="Get a bulk quote" defaultValue={secondaryLabel} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="heroSecondaryHref">Secondary button link</Label>
          <Input id="heroSecondaryHref" name="heroSecondaryHref" placeholder="/contact" defaultValue={secondaryHref} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          <Save className="h-4 w-4" /> {isPending ? "Saving..." : "Save hero text"}
        </Button>
      </div>
    </form>
  );
}
