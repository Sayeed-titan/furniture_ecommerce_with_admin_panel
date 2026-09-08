# SEO — audit + roadmap

**Audited:** 2026-09-07 · against `main` working tree
**Verdict:** the site is well built but **currently close to invisible to search
engines**. There is no sitemap, no robots file, no structured data, and — most
costly — no per-product metadata, so every one of your product pages tells
Google the same title and description. None of this is hard to fix; it is
mostly missing plumbing rather than bad code.

Run the `seo-master` agent to execute any phase below.

---

## Scorecard

| Tier | Area | State |
|---|---|---|
| 1 | Indexability (robots, sitemap, canonicals) | ❌ Absent |
| 2 | On-page metadata + structured data | ⚠️ Partial — static pages only |
| 3 | Site architecture / internal linking | ⚠️ Category pages missing |
| 4 | Core Web Vitals | ⚠️ Image optimisation disabled |
| 5 | i18n / local SEO | ❌ Bengali not indexable |

---

## Findings

Each item cites where it lives, why it costs traffic, and Impact × Effort.

### 🔴 F1 — Product pages have no metadata at all — **High × S**
`src/app/(site)/products/[slug]/page.tsx` exports no `generateMetadata`. Every
product page therefore inherits the root default from
[layout.tsx:29](../src/app/layout.tsx) — title "President Furniture",
description the same generic site blurb.

**Cost:** your product pages are the pages people actually search for
("executive office chair price in Bangladesh"). Right now they are all
duplicates in Google's eyes and none of them can rank on their own terms.
This is the single highest-value fix on the list.

**Fix:** add `generateMetadata` producing a unique title
(`{name} — {category} | President Furniture`), a description drawn from the
product description, canonical URL, and OG image from the primary product photo.

### 🔴 F2 — No `robots.ts` and no `sitemap.ts` — **High × S**
Neither file exists anywhere under `src/app`. Google has no map of the site and
no crawl directives.

**Cost:** new products may take weeks to be discovered, or never be. Checkout,
cart, and account routes are crawlable and will waste crawl budget and can
surface in results.

**Fix:** `src/app/sitemap.ts` reading products + categories from Prisma
(with `lastModified` from `updatedAt`), and `src/app/robots.ts` that declares
the sitemap and disallows `/admin`, `/account`, `/cart`, `/checkout`, `/order`,
`/api`.

### 🔴 F3 — No `metadataBase`, so canonical and OG URLs are broken — **High × S**
[layout.tsx:28](../src/app/layout.tsx) sets `title` and `description` but no
`metadataBase`. There is also no `NEXT_PUBLIC_SITE_URL` in the environment
(only `NEXTAUTH_URL` and Supabase keys exist).

**Cost:** without an absolute base, OpenGraph image URLs resolve relative and
social shares render blank. Canonicals cannot be emitted at all, which leaves
the filter-param duplicates in F6 unresolved.

**Fix:** add `NEXT_PUBLIC_SITE_URL`, set `metadataBase: new URL(...)`, and add
`alternates.canonical` per route.

### 🔴 F4 — Zero structured data on the entire site — **High × M**
A repo-wide search for `application/ld+json` and `schema.org` returns nothing.

**Cost:** you forfeit every rich result. Product schema is what puts price,
availability and stock status directly in the search listing — the single
biggest click-through-rate lever available to an e-commerce site. Competitors
who have it will out-click you even when you rank alongside them.

**Fix, in priority order:**
- `Product` + `Offer` (price, `priceCurrency: "BDT"`, availability from
  `stockStatus`) on product pages
- `BreadcrumbList` on product and category pages
- `Organization` + `WebSite` on the root layout
- `LocalBusiness` / `Store` with real address, phone, opening hours
- `FAQPage` on `/faq`

**Do not** add `AggregateRating` or `Review` schema until you have genuine
customer reviews stored. Fabricated ratings are a manual-action penalty.

### 🟠 F5 — Category slugs exist but have no pages — **High × M**
`Category` carries a unique `slug` ([schema.prisma](../prisma/schema.prisma))
but there is no `/products/category/[slug]` route — the route list under
`src/app/(site)` has only `/products` and `/products/[slug]`. Filtering happens
via query params (`?category=`, `?material=`, `?room=` —
[products/page.tsx:26](<../src/app/(site)/products/page.tsx>)).

**Cost:** category terms are usually the highest-volume commercial keywords
("office furniture in Dhaka", "steel almirah"). Query-param filters give Google
nothing durable to rank. You are missing the entire middle of the funnel.

**Fix:** real routes at `/products/category/[slug]` with their own H1,
metadata, intro copy, and JSON-LD. Same for room type if those map to how
people search.

### 🟠 F6 — Filter params create duplicate content — **Med × S**
The three filter params combine into many URLs all serving near-identical
listings, with no canonical tag to consolidate them.

**Fix:** self-referencing canonical on `/products`, pointing filtered
variants at the clean category URL once F5 lands.

### 🟠 F7 — `images.unoptimized: true` hurts LCP — **Med × M**
[next.config.ts](../next.config.ts) disables image optimisation. The comment
documents a real reason — Hostinger's standalone wrapper breaks `next/image`'s
self-fetch for local `/uploads/...` files — so this was a correct call at the
time, not an oversight.

**Cost:** full-size JPEGs ship to mobile users instead of sized WebP/AVIF. LCP
is a confirmed ranking factor and a conversion factor.

**Fix options:** serve uploads through a loader that Hostinger's CDN can
transform, move uploads to Supabase storage (already a configured remote
pattern) and re-enable optimisation for that host, or resize on upload in
`src/app/api/admin/upload/route.ts`. Measure with PageSpeed Insights first —
if the CDN is already serving these well, this drops in priority.

### 🟠 F8 — Bengali content is not indexable — **Med × L**
Locale switching is client-side (`LocaleProvider` + `localStorage`), so both
languages share one URL and [layout.tsx:42](../src/app/layout.tsx) is
hard-coded `lang="en"`.

**Cost:** Google only ever sees the English render. Every Bengali search query
— likely a large share of your actual market — has nothing of yours to match.

**Fix:** this is a real architectural decision, not a quick win. Localised
routes (`/bn/...`) with `alternates.languages` and `hreflang`. Worth scoping
deliberately; large payoff for Bangladesh traffic, but it touches routing
everywhere.

### 🟡 F9 — `force-dynamic` on cacheable pages — **Med × S**
Set on `/`, `/products`, `/products/[slug]`, and also on the static policy
pages `/delivery`, `/returns`, `/terms`, `/warranty`.

**Cost:** every crawl and every visitor triggers fresh DB queries. Slower TTFB,
worse CWV, wasted crawl budget. On the policy pages there is no upside at all.

**Fix:** swap to `revalidate` + `revalidateTag` on admin writes. The policy
pages can be near-static.

### 🟡 F10 — No OG image, manifest, or social cards — **Med × S**
Only `src/app/icon.svg` exists; no `opengraph-image`, no `manifest.ts`, no
`twitter` metadata.

**Cost:** every WhatsApp, Facebook and LinkedIn share of your site renders as a
bare grey link. In Bangladesh, where WhatsApp and Facebook sharing carry real
referral weight, this is worth more than its tier suggests.

### 🟡 F11 — No SEO override fields on products — **Low × S**
`Product` and `Category` have no `metaTitle` / `metaDescription`. Generated
metadata will be fine for most items, but you cannot hand-tune a page that
matters without a code change.

**Fix:** optional nullable columns + an "SEO" section in the admin product
form, falling back to generated values.

### ✅ What is already right
- One `<h1>` per page, verified across all site routes and landing variants
- Clean, slug-based, lowercase product URLs
- Real `404` status with `noindex`, and a branded 404 page
- `generateMetadata`/`metadata` on all static marketing and policy pages
- Semantic headings and accessible markup throughout

---

## Roadmap

### Phase 1 — Get indexed (do this first; ~half a day)
1. `NEXT_PUBLIC_SITE_URL` + `metadataBase` — F3
2. `src/app/robots.ts` — F2
3. `src/app/sitemap.ts`, DB-driven — F2
4. `generateMetadata` on `/products/[slug]` — F1
5. Canonicals on `/products` and `/products/[slug]` — F6

**Ships:** every product becomes independently rankable and discoverable.
This phase alone is most of the available win.

### Phase 2 — Win the click (~1 day)
6. `Product` + `Offer` JSON-LD — F4
7. `Organization` + `WebSite` + `LocalBusiness` JSON-LD — F4
8. `BreadcrumbList` + visible breadcrumbs — F4
9. `FAQPage` on `/faq` — F4
10. `opengraph-image` + `manifest.ts` + Twitter cards — F10

**Ships:** price and stock in search results; shares stop rendering blank.

### Phase 3 — Grow the surface (~2–3 days)
11. `/products/category/[slug]` routes with real copy — F5
12. `revalidate` instead of `force-dynamic` — F9
13. Image optimisation strategy — F7
14. SEO override fields in admin — F11

### Phase 4 — Bengali + content (scope separately)
15. Localised routes + `hreflang` — F8
16. Category and buying-guide copy targeting real queries
17. Ongoing: one substantial page per target keyword cluster

---

## What you must do yourself (I cannot)

These need your accounts and cannot be done from the codebase:

1. **Google Search Console** — verify the domain (DNS TXT record is the durable
   method), submit `https://<domain>/sitemap.xml`, then watch Coverage weekly.
2. **Bing Webmaster Tools** — import from Search Console; takes two minutes.
3. **Google Business Profile** — for a furniture business with a physical
   showroom this is very likely your highest-ROI single action outside the
   code. Real address, phone, hours, and photos. Keep the name, address and
   phone identical to what the `LocalBusiness` schema will say.
4. **Local citations** — consistent NAP on Bangladeshi business directories.
5. **Analytics** — GA4 or Plausible, so Phase 1's effect is measurable.

---

## How we measure

| Phase | Metric | Where |
|---|---|---|
| 1 | Indexed page count rising toward product count | Search Console → Pages |
| 1 | Product pages appearing for their own names | Search Console → Queries |
| 2 | Rich result eligibility, no schema errors | Search Console → Enhancements |
| 2 | CTR rising at flat position | Search Console → Performance |
| 3 | Category URLs earning impressions | Search Console → Pages |
| 3 | LCP under 2.5s on mobile | PageSpeed Insights / CWV report |
| 4 | Bengali-language queries appearing | Search Console → Queries |

Expect Phase 1 to show movement in **2–6 weeks**, not days — indexing is not
instant and nobody can make it so.

---

## Things that are not ranking factors

Stated once so no time gets spent on them: keyword density, the `meta keywords`
tag, domain age tricks, bounce rate as a direct signal, submitting to hundreds
of directories, or buying links. Ignore any vendor who sells these.
