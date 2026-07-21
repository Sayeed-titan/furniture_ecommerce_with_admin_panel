"use client";

import { useTranslation } from "@/lib/i18n/use-translation";
import { EnumLabel } from "@/components/site/enum-label";

export function ProductSpecTable({
  material,
  room,
  color,
  dimensions,
}: {
  material: string;
  room: string;
  color?: string | null;
  dimensions?: string | null;
}) {
  const { t } = useTranslation();

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: t("productDetail.specMaterial"), value: <EnumLabel group="materials" value={material} /> },
    { label: t("productDetail.specRoom"), value: <EnumLabel group="rooms" value={room} /> },
  ];
  if (color) rows.push({ label: t("productDetail.specColor"), value: color });
  if (dimensions) rows.push({ label: t("productDetail.specDimensions"), value: dimensions });

  return (
    <div>
      <h2 className="text-sm font-semibold text-neutral-900">{t("productDetail.specsHeading")}</h2>
      <dl className="mt-3 divide-y divide-neutral-100 rounded-lg border border-neutral-200">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between px-4 py-2.5 text-sm">
            <dt className="text-neutral-500">{row.label}</dt>
            <dd className="font-medium text-neutral-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
