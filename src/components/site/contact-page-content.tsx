"use client";

import { LeadForm } from "@/components/site/lead-form";
import { useTranslation } from "@/lib/i18n/use-translation";

export function ContactPageContent() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">{t("contactPage.heading")}</h1>
      <p className="mt-2 text-neutral-600">{t("contactPage.subtitle")}</p>
      <div className="mt-8">
        <LeadForm />
      </div>
    </div>
  );
}
