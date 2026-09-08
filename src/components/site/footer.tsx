"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

/** Simple brand glyphs — lucide-react no longer ships social/brand icons. */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.9.2-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.3-3.8 3.8v2.1H9.9v3h2.6V21h3Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.6 7.7a2.7 2.7 0 0 0-1.9-1.9C18 5.3 12 5.3 12 5.3s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C2 9.4 2 12 2 12s0 2.6.4 4.3a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.3.4-4.3s0-2.6-.4-4.3ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}

/** Simple TikTok glyph — lucide-react has no TikTok icon either. */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.7v2.6c-1.3 0-2.5-.4-3.5-1.1v6.4a5.4 5.4 0 1 1-4.6-5.4v2.7a2.7 2.7 0 1 0 1.9 2.6V3h2.7Z" />
    </svg>
  );
}

export function SiteFooter({
  shopAddress,
  googleMapsUrl,
  facebookUrl,
  instagramUrl,
  youtubeUrl,
  tiktokUrl,
}: {
  shopAddress?: string | null;
  googleMapsUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  tiktokUrl?: string | null;
}) {
  const { t } = useTranslation();

  const sections = [
    {
      heading: t("footer.shopHeading"),
      links: [
        { href: "/products", label: t("nav.products") },
        { href: "/wishlist", label: t("nav.wishlist") },
        { href: "/cart", label: t("nav.cart") },
      ],
    },
    {
      heading: t("footer.companyHeading"),
      links: [
        { href: "/about", label: t("nav.about") },
        { href: "/contact", label: t("nav.contact") },
      ],
    },
    {
      heading: t("footer.helpHeading"),
      links: [
        { href: "/faq", label: t("footer.faq") },
        { href: "/delivery", label: t("footer.delivery") },
        { href: "/returns", label: t("footer.returns") },
        { href: "/warranty", label: t("footer.warranty") },
        { href: "/terms", label: t("footer.terms") },
        { href: "/privacy", label: t("footer.privacy") },
      ],
    },
  ];

  const socialLinks = [
    { href: facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { href: instagramUrl, label: "Instagram", Icon: InstagramIcon },
    { href: youtubeUrl, label: "YouTube", Icon: YoutubeIcon },
    { href: tiktokUrl, label: "TikTok", Icon: TikTokIcon },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-900">
            President Furniture
          </span>
          <p className="mt-2 max-w-xs text-sm text-neutral-500">
            Office &amp; industrial furniture — supplied, delivered, and installed across Bangladesh.
          </p>

          {shopAddress && (
            <div className="mt-4 flex items-start gap-1.5 text-sm text-neutral-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
              <span>
                {shopAddress}
                {googleMapsUrl && (
                  <>
                    {" "}
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-neutral-900 underline underline-offset-2"
                    >
                      View on map
                    </a>
                  </>
                )}
              </span>
            </div>
          )}

          {socialLinks.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-neutral-500 hover:text-neutral-900"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}
        </div>

        {sections.map((section) => (
          <div key={section.heading}>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">
              {section.heading}
            </p>
            <ul className="mt-3 space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-600 hover:text-neutral-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} President Furniture. {t("footer.rights")}
          </p>
          <Link href="/report" className="font-medium text-neutral-600 hover:text-neutral-900">
            {t("footer.reportIssue")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
