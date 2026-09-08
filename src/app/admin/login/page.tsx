import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { ThroneMark } from "@/components/site/brand/logo";
import { ThemeToggle } from "@/components/site/theme/theme-toggle";
import { getAllSettings, SETTING_KEYS } from "@/lib/settings";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const settings = await getAllSettings();
  const brandIconUrl = settings[SETTING_KEYS.brandIconUrl];
  const brandLogoUrl = settings[SETTING_KEYS.brandLogoUrl];

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-24">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
          {brandLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded asset
            <img src={brandLogoUrl} alt="President Furniture" className="h-9 w-auto object-contain" />
          ) : (
            <>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#171310] text-[#d9b779]">
                {brandIconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded asset
                  <img src={brandIconUrl} alt="" className="h-6 w-6 object-contain" />
                ) : (
                  <ThroneMark className="h-6 w-6" />
                )}
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-sm font-semibold tracking-tight text-neutral-900">President</span>
                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                  Admin
                </span>
              </span>
            </>
          )}
          </div>
          <ThemeToggle />
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to manage your store.</p>
          <div className="mt-6">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
