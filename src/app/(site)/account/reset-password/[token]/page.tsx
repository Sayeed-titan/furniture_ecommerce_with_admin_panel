import { ResetPasswordForm } from "@/components/site/account/reset-password-form";

export const metadata = { title: "Reset Password" };

type Params = Promise<{ token: string }>;

export default async function ResetPasswordPage({ params }: { params: Params }) {
  const { token } = await params;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
      <p className="mt-1 text-sm text-neutral-500">Choose a new password for your account.</p>
      <div className="mt-6 rounded-xl border border-neutral-200 p-6">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
