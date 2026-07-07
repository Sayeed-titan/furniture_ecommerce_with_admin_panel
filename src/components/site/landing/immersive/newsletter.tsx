"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n/use-translation";

export function NewsletterStrip() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter signup",
          email,
          message: "Subscribed from the homepage newsletter strip.",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="border-t border-neutral-200 bg-neutral-900">
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{t("newsletter.heading")}</h2>
        <p className="mt-2 text-neutral-400">{t("newsletter.subtitle")}</p>

        {status === "success" ? (
          <p className="mt-6 text-sm text-emerald-400">{t("newsletter.success")}</p>
        ) : (
          <form onSubmit={onSubmit} className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              required
              placeholder={t("newsletter.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
            />
            <Button type="submit" disabled={status === "loading"} className="shrink-0">
              {status === "loading" ? t("newsletter.buttonLoading") : t("newsletter.button")}
            </Button>
          </form>
        )}
        {status === "error" && <p className="mt-3 text-sm text-red-400">{t("newsletter.error")}</p>}
      </div>
    </section>
  );
}
