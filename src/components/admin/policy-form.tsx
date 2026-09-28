"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { savePolicyContent, type SavePolicyState } from "@/lib/actions/policies";

function PolicyField({
  name,
  label,
  description,
  defaultValue,
}: {
  name: string;
  label: string;
  description: string;
  defaultValue: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <p className="text-xs text-neutral-500">{description}</p>
      <RichTextEditor name={name} defaultValue={defaultValue} />
    </div>
  );
}

export function PolicyForm({
  defaults,
}: {
  defaults: { terms: string; delivery: string; returns: string; warranty: string };
}) {
  const initialState: SavePolicyState = {};
  const [state, formAction, isPending] = useActionState(savePolicyContent, initialState);

  useEffect(() => {
    if (state.ok) toast.success("Policy pages updated.");
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <p className="rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
        Use the toolbar for headings, bullet points, and bold text. Leave a field blank and save to
        reset that page back to its default text.
      </p>

      <PolicyField
        name="termsContent"
        label="Terms & Conditions"
        description="Shown at /terms."
        defaultValue={defaults.terms}
      />
      <PolicyField
        name="deliveryContent"
        label="Delivery Information"
        description="Delivery time, delivery charges, and fitting & installation — shown at /delivery."
        defaultValue={defaults.delivery}
      />
      <PolicyField
        name="returnPolicyContent"
        label="Return Policy"
        description="Shown at /returns."
        defaultValue={defaults.returns}
      />
      <PolicyField
        name="warrantyContent"
        label="Warranty"
        description="Shown at /warranty."
        defaultValue={defaults.warranty}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          <Save className="h-4 w-4" /> {isPending ? "Saving..." : "Save policy pages"}
        </Button>
      </div>
    </form>
  );
}
