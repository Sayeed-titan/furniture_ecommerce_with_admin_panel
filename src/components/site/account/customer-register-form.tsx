"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerCustomer, type RegisterState } from "@/lib/actions/customer-auth";

export function CustomerRegisterForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState<RegisterState, FormData>(registerCustomer, {});
  // React resets uncontrolled form fields once a form action resolves successfully,
  // so credentials must be captured at submit time, not read back afterward.
  const credsRef = useRef<{ email: string; password: string } | null>(null);

  useEffect(() => {
    if (!state.ok || !credsRef.current) return;
    signIn("customer", {
      email: credsRef.current.email,
      password: credsRef.current.password,
      redirect: false,
    }).then(() => {
      router.push("/account");
      router.refresh();
    });
  }, [state.ok, router]);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        const formData = new FormData(e.currentTarget);
        credsRef.current = {
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        };
      }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" minLength={8} required autoComplete="new-password" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" minLength={8} required autoComplete="new-password" />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending || state.ok} className="w-full">
        {pending ? "Creating account..." : state.ok ? "Signing you in..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/account/login" className="font-medium text-neutral-900 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
