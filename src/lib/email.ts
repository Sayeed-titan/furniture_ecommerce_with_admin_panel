/**
 * Server-only email notifications via Resend's HTTPS API (no SDK, no extra
 * dependency). Configured via env:
 *
 *   RESEND_API_KEY   Resend API key (https://resend.com)
 *   EMAIL_FROM       verified sender, e.g. "President <alerts@yourdomain.com>"
 *   NOTIFY_EMAIL     where business notifications are sent
 *
 * When these aren't set, isEmailConfigured() is false and sendNotification()
 * no-ops (returns false) instead of throwing — notifications are a
 * best-effort side channel, never a reason to fail the user's request.
 */

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.NOTIFY_EMAIL
  );
}

export async function sendNotification(input: {
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!isEmailConfigured()) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [process.env.NOTIFY_EMAIL],
        subject: input.subject,
        html: input.html,
        reply_to: input.replyTo,
      }),
    });

    if (!res.ok) {
      console.error("Email notification failed:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email notification error:", err);
    return false;
  }
}

/** Minimal HTML escaping for interpolating user-provided text into emails. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
