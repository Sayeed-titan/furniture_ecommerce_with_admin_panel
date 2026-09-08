"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation, useDisplayFontClassName } from "@/lib/i18n/use-translation";

const ShowroomScene = dynamic(() => import("./scene").then((m) => m.ShowroomScene), {
  ssr: false,
  loading: () => null,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// WebGL support never changes mid-session, so this never notifies — it only
// exists to give useSyncExternalStore a client-only snapshot that safely
// diverges from the server snapshot (always false) without a hydration warning.
const noopSubscribe = () => () => {};
const getServerSnapshot = () => false;

/**
 * Type 7's signature element: a Three.js scene of abstract furniture-form
 * fragments floating in the hero. Falls back to a static gradient (no
 * Canvas mounted at all) when WebGL isn't available, and freezes the
 * animation for prefers-reduced-motion — handled inside scene.tsx.
 */
export function ShowroomHero() {
  const { t } = useTranslation();
  const displayFont = useDisplayFontClassName();
  const canRender3d = useSyncExternalStore(noopSubscribe, supportsWebGL, getServerSnapshot);

  return (
    <section className="relative flex min-h-[600px] w-full items-center overflow-hidden bg-[#171310] sm:min-h-[680px] lg:min-h-[88vh]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_35%,rgba(217,183,121,0.18),transparent_60%)]" />

      {canRender3d && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Suspense fallback={null}>
            <ShowroomScene />
          </Suspense>
        </div>
      )}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d9b779]">
            {t("showroom.heroKicker")}
          </p>
          <h1
            className={`mt-4 text-4xl font-semibold leading-[1.08] text-onmedia sm:text-5xl lg:text-6xl ${displayFont}`}
          >
            {t("showroom.heroTitle")}
          </h1>
          <p className="mt-5 text-base text-onmedia/75 sm:text-lg">
            {t("showroom.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-[#d9b779] text-[#171310] hover:bg-[#c9a563]">
              <Link href="/products">{t("showroom.ctaPrimary")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-onmedia/30 bg-transparent text-onmedia hover:bg-onmedia/10"
            >
              <Link href="/contact">{t("showroom.ctaSecondary")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
