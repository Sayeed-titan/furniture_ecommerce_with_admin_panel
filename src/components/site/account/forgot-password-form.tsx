"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { requestPasswordReset, type RequestResetState } from "@/lib/actions/password-reset";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<RequestResetState, FormData>(
    requestPasswordReset,
    {}
  );

  if (state.sent) {
    return (
      <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
        If that email has an account, we&apos;ve sent a link to reset your password. It expires
        in 1 hour.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
