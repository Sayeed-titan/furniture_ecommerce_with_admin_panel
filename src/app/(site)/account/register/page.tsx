import { CustomerRegisterForm } from "@/components/site/account/customer-register-form";

export const metadata = { title: "Create Account" };

export default function AccountRegisterPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
      <p className="mt-1 text-sm text-neutral-500">Save your details for faster checkout.</p>
      <div className="mt-6 rounded-xl border border-neutral-200 p-6">
        <CustomerRegisterForm />
      </div>
    </div>
  );
}
