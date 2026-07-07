"use client";

import { useState } from "react";
import { Bug, Lightbulb, Wrench, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

type IssueType = "BUG" | "FEATURE" | "CHANGE" | "QUESTION";

const TYPE_META: { value: IssueType; icon: typeof Bug; key: string }[] = [
  { value: "BUG", icon: Bug, key: "report.typeBug" },
  { value: "FEATURE", icon: Lightbulb, key: "report.typeFeature" },
  { value: "CHANGE", icon: Wrench, key: "report.typeChange" },
  { value: "QUESTION", icon: HelpCircle, key: "report.typeQuestion" },
];

export function ReportForm() {
  const { t } = useTranslation();
  const [type, setType] = useState<IssueType>("BUG");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const body = String(data.get("body") ?? "").trim();

    const nextErrors: { title?: string; body?: string } = {};
    if (title.length < 3) nextErrors.title = t("report.titleRequired");
    if (body.length < 10) nextErrors.body = t("report.bodyRequired");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          body,
          reporterName: String(data.get("reporterName") ?? "").trim() || undefined,
          reporterEmail: String(data.get("reporterEmail") ?? "").trim() || undefined,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
      setType("BUG");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        {t("report.success")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>{t("report.typeLabel")}</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TYPE_META.map(({ value, icon: Icon, key }) => {
            const active = type === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-3 text-center text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
                  active
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                )}
              >
                <Icon className="h-5 w-5" />
                {t(key)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">{t("report.titleLabel")}</Label>
        <Input id="title" name="title" placeholder={t("report.titlePlaceholder")} />
        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">{t("report.bodyLabel")}</Label>
        <textarea
          id="body"
          name="body"
          rows={5}
          placeholder={t("report.bodyPlaceholder")}
          className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        />
        {errors.body && <p className="text-sm text-red-600">{errors.body}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="reporterName">{t("report.nameLabel")}</Label>
          <Input id="reporterName" name="reporterName" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reporterEmail">{t("report.emailLabel")}</Label>
          <Input id="reporterEmail" name="reporterEmail" type="email" />
        </div>
      </div>

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? t("report.submitting") : t("report.submit")}
      </Button>
      {status === "error" && <p className="text-sm text-red-600">{t("report.error")}</p>}
    </form>
  );
}
