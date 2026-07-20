import { Suspense } from "react";
import { CustomerLoginForm } from "@/components/site/account/customer-login-form";

export const metadata = { title: "Sign In" };

export default function AccountLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-1 text-sm text-neutral-500">Track your orders and check out faster.</p>
      <div className="mt-6 rounded-xl border border-neutral-200 p-6">
        <Suspense fallback={null}>
          <CustomerLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
