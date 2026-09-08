"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { adminSendPasswordReset, type AdminForceResetState } from "@/lib/actions/password-reset";

/** "Send reset link" action for a customer who contacted support locked out
 *  of their account. Same secure emailed-token flow as self-service — admin
 *  never sees or sets a password. */
export function SendResetLinkButton({ customerId, name }: { customerId: string; name: string }) {
  const [state, formAction] = useActionState<AdminForceResetState, FormData>(
    adminSendPasswordReset,
    {}
  );

  useEffect(() => {
    if (state.sent) toast.success(`Reset link sent to ${name}.`);
    if (state.error) toast.error(state.error);
  }, [state, name]);

  return (
    <form action={formAction}>
      <input type="hidden" name="customerId" value={customerId} />
      <ConfirmSubmit message={`Send ${name} a password reset link? Their current password keeps working until they use it.`}>
        Send reset link
      </ConfirmSubmit>
    </form>
  );
}
