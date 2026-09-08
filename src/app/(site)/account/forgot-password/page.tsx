import Link from "next/link";
import { ForgotPasswordForm } from "@/components/site/account/forgot-password-form";

export const metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Forgot your password?</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Enter your email and we&apos;ll send you a link to reset it.
      </p>
      <div className="mt-6 rounded-xl border border-neutral-200 p-6">
        <ForgotPasswordForm />
      </div>
      <p className="mt-4 text-center text-sm text-neutral-500">
        <Link href="/account/login" className="font-medium text-neutral-900 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
