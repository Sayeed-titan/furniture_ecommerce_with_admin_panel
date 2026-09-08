"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { savePolicyContent, type SavePolicyState } from "@/lib/actions/policies";

const textareaClass =
  "flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900";

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
      <textarea id={name} name={name} rows={10} defaultValue={defaultValue} className={textareaClass} />
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
        Formatting: start a line with <code>## </code> for a section heading, <code>- </code> for a
        bullet point, and wrap text in <code>**like this**</code> for bold. Leave a field blank and
        save to reset that page back to its default text.
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
