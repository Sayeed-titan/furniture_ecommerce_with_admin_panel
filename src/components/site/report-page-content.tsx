"use client";

import { ReportForm } from "@/components/site/report-form";
import { useTranslation } from "@/lib/i18n/use-translation";

export function ReportPageContent() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">{t("report.heading")}</h1>
      <p className="mt-2 text-neutral-600">{t("report.subtitle")}</p>
      <div className="mt-8">
        <ReportForm />
      </div>
    </div>
  );
}
