# Feature request backlog — 2026-09-06

Captured from the client's latest round of feedback. Nothing here is
implemented yet — this is the list to review before splitting work across
agents. Items are grouped by area; each has enough detail to hand to an
agent on its own. Open questions are called out explicitly rather than
assumed.

---

## 1. Orders — status update is broken — FIXED (2026-09-06)

Client tested with the dev server running and confirmed the write itself
was succeeding (a manual reload showed the new status), but it never
appeared without a reload. That ruled out my first fix (revalidating the
detail path) and pointed at the real mechanism: every admin page here is
`export const dynamic = "force-dynamic"` and reads straight from Prisma —
there's no Next.js cache entry on those routes for `revalidatePath` to
invalidate, and per this project's own Next.js docs
(`node_modules/next/dist/docs/01-app/02-guides/server-actions.md` /
`.../functions/refresh.md`), a Server Action's response only carries a
fresh re-render of the current route when it invalidates something Next.js
actually cached — otherwise the client keeps showing its last render. The
correct primitive for "re-render the current route regardless of caching"
is `refresh()` from `next/cache`.

Fix applied: added `refresh()` (alongside the existing `revalidatePath`
calls, which still matter for other visitors' next navigation) to every
mutating admin server action, since this is a systemic issue affecting all
of them, not just order status — `orders.ts`, `categories.ts`, `leads.ts`,
`issues.ts`, `settings.ts`, `product-images.ts`, `users.ts`, `roles.ts`,
`products.ts` (`deleteProduct` only — `createProduct`/`updateProduct`
already `redirect()`, which forces a fresh render on its own).

Client retested and the dropdown still didn't visually update — that
exposed a **second, independent bug**: the status `<select>` uses
`defaultValue={order.status}` with no `key`. React only applies
`defaultValue` on an element's first mount; on any later re-render
(including a correctly-refreshed one from `refresh()`), React reuses the
same DOM node and does not reapply `defaultValue`, so the dropdown kept
showing its old selection regardless of whether the backend data was
fresh. Fixed by adding `key={order.status}` (`orders/[id]/page.tsx`) so
React remounts the `<select>` whenever the status actually changes. Same
pattern found and fixed on the Leads status dropdown
(`leads/page.tsx`) and the Settings "Active design" dropdown
(`settings/page.tsx`), which had the identical issue.

Confirmed `npx tsc --noEmit` and `eslint` clean. **Still not verified in a
live browser session** — no local `DATABASE_URL` in this environment;
please retest per the steps given in chat.

## 2. Orders — search & filter — DONE (2026-09-06)

Added to `src/app/admin/(dashboard)/orders/page.tsx`: a search box (order
number, ship name/phone, guest name/phone/email, and registered customer
name/phone/email), plus filters for payment method and payment status
(reusing the existing `SearchInput`/`FilterSelect` components from the
Products page), plus a new date-range filter
(`src/components/admin/date-range-filter.tsx`, new component). Status tabs
now preserve the other active filters when switching instead of resetting
them, and their counts reflect the other active filters too (so filtering
by a payment method updates what each status tab count shows). `npx tsc
--noEmit` and `eslint` clean. Export CSV still exports everything
regardless of filters — client didn't ask for that to change, flag if
that's wanted too. **Not yet tested in a live browser** — no local DB
access.

## 3. Shipping setup (new, admin-configurable) — DONE (2026-09-07)

Built as decided: **destination-zone based**, not per-product. New
`ShippingZone` model (name, fee, isDefault) + full admin CRUD at
`/admin/shipping` (`src/lib/actions/shipping.ts`,
`src/components/admin/shipping-zone-row.tsx`) — create/rename/re-price/
delete a zone, and a "Make default" action that atomically unsets any
other default. A fee of 0 is how a zone offers free shipping (e.g. seed a
"Inside Dhaka" zone at 0 for free shipping there, "Outside Dhaka" at
whatever real fee you want).

Checkout (`checkout-form.tsx`) now shows a "Delivery area" dropdown
(pre-selected to the default zone) and a real Shipping/Total breakdown
instead of a hardcoded `shippingFee = 0`. `placeOrder`
(`src/lib/actions/orders.ts`) resolves the fee server-side from the
selected zone (never trusts a client-supplied amount) and stores which
zone was used on the order — shown on the admin order detail page next to
the shipping fee line.

Migration: `prisma/migrations/20260906140000_add_shipping_and_materials/migration.sql`
(shared with item 5 below) creates `ShippingZone` and seeds two starter
zones at a $0 fee — **you'll want to set real fee amounts** from
`/admin/shipping` once this is live, the seeded zones are just placeholders
so checkout isn't broken on day one.

## 4. Media / product images — DONE (2026-09-06)

`src/components/admin/image-url-uploader.tsx` now supports: drag-and-drop
(drop files anywhere in the uploader box), clipboard paste (copy a file in
Windows Explorer, click the URL field, Ctrl+V), and the existing multi-file
picker and URL-paste path — all three funnel through one shared
`uploadFiles()` that calls `/api/admin/upload` then `addProductImage` per
file. While in this file, also closed a permission gap in
`src/app/api/admin/upload/route.ts`: it only checked for *any* admin
session, not `products.edit` specifically — meaning a role without
products.edit could still upload arbitrary files to storage even though
the follow-up `addProductImage` call would then correctly reject saving it
to a product. Now checks `products.edit` directly. `npx tsc --noEmit` and
`eslint` clean. **Not yet tested in a live browser** — no local DB access.

## 5. Classification & stock section — DONE (2026-09-07)

All three parts built:

- **Material → real table.** New `Material` model (`name`, optional
  `nameBn`) replacing the `MaterialType` enum everywhere it was used:
  admin product form's dropdown, public product filters, product detail
  spec table, and the two landing-page components that referenced
  materials directly (`immersive/material-showcase.tsx`,
  `creative_fable5/piece-card.tsx`). New admin CRUD at `/admin/materials`
  (`src/lib/actions/materials.ts`, `material-row.tsx`) — same
  create/rename/delete-when-empty pattern as Categories. Migration backfills
  the 6 existing enum values into real rows (with Bangla names) and remaps
  every product's `material` column to the new `materialId` FK — see
  `prisma/migrations/20260906140000_add_shipping_and_materials/migration.sql`.
  `prisma/seed.ts` updated to upsert materials by name instead of the enum.
- **Reorder-level-based low-stock suggestion.** Added `reorderLevel` (int,
  default 5) to `Product`. The admin product form now shows a live
  "Suggested: Low Stock" hint next to the Stock status dropdown as you type
  quantity/reorder level — informational, doesn't force the field (matches
  the "at minimum, manual override + auto-suggestion" fallback). The quick
  restock action (below) *does* auto-apply the derived status, since that's
  the one place where "stock just changed" is unambiguous.
- **Restock flow.** New `adjustStock` action
  (`src/lib/actions/products.ts`) + a small inline "+ qty" control on the
  admin Products list (`src/components/admin/restock-control.tsx`) — click
  Restock, type an amount, it adds to the existing quantity and
  auto-updates stockStatus (unless the product is MADE_TO_ORDER, which
  isn't quantity-tracked the same way) — no more re-creating a product to
  add units.

**Also found and fixed a real bug while doing this**, unrelated to
materials directly: the "Administrator role always has every permission"
guarantee only held at the moment a role was first seeded — adding
`materials`/`shipping` permission modules here (and `backup`, added by
another session in parallel) would have silently never reached an
already-migrated Administrator row. Fixed in `src/lib/authz.ts` — see item
21 below.

`npx tsc --noEmit` and `eslint` clean across all of items 3/5/8+21. **Not
yet tested in a live browser** — no local DB access.

## 21. RBAC fix — protected roles now always compute full permissions dynamically

Not something the client asked for — found while adding the `materials`/
`shipping` permission modules for item 5 and 3. `getRoleInfo`
(`src/lib/authz.ts`) previously read a role's permissions straight from
its stored DB column; for the protected Administrator role, that column
was only ever a complete list at the moment it was first seeded. Every
permission module added to the code afterward (this session's
`materials`/`shipping`, and `backup` from a concurrent session) would
silently never reach an already-migrated Administrator row, since nothing
re-synced it and the role editor (`/admin/roles`) refuses to touch
protected roles at all.

Fixed: `getRoleInfo` now computes a protected role's permissions as the
*current* `allPermissions()` list unconditionally, never from the stored
column — so "Administrator always has every permission" is an invariant
enforced at read time, not a one-time seed fact. Also updated
`prisma/seed.ts` (upsert now refreshes the stored column too, for display
consistency) and `/admin/roles`' list page (shows `allPermissions()` for
protected roles rather than whatever's stored) so nothing can visibly
drift from what's actually enforced.

## 6. Pricing — discount display — DONE (2026-09-06)

Storefront already showed the struck-through `compareAtPrice`, so what was
missing was specifically in the admin Pricing section, as asked. Added a
live discount indicator to `product-form.tsx`'s Pricing card: as the admin
types Price/Compare-at price, a green "`X`% off" pill + savings-amount
sentence appears immediately (or an amber warning if compare-at isn't
actually higher than price). Added a shared `discountPercent()` helper to
`src/lib/utils.ts` (single source of truth for the math) and reused it to
add a matching "`X`% off" label next to the existing struck-through price
on the storefront product card and product detail page, which only showed
the crossed-out price before, not the percentage. `npx tsc --noEmit` and
`eslint` clean. **Not yet tested in a live browser** — no local DB access.

## 7. Description — rich text editor

Replace the current plain `<textarea>` for product `description` with a
WYSIWYG/rich-text editor (bold, lists, headings, etc.), storing formatted
HTML (or Markdown) instead of plain text, and rendering it correctly on the
public product page. **"have to give it a thought"** — client flagged this
as needing a decision, not just a straight swap: need to pick a library,
decide on sanitization for stored HTML (XSS risk since it renders on the
public site), and decide storage format (HTML vs Markdown vs a JSON doc
format like Tiptap's).

## 8. Payment methods — DONE (2026-09-07)

Built as decided: a simple **on/off toggle per method**, not a new
gateway — SSLCommerz's own hosted checkout already supports Visa/
Mastercard/Amex/bKash/Nagad/mobile banking once "Online Payment" is
enabled, so there was nothing new to integrate there.

Added a "Payment methods" section to `/admin/settings` with two
checkboxes (Cash on Delivery, Online Payment). Checkout
(`checkout-form.tsx`) now only renders the radio button for whichever
methods are actually enabled — Online Payment additionally still requires
SSLCommerz to be configured on the server (env vars), same as before,
so the setting can't turn on a gateway that isn't actually wired up.
`placeOrder` (`src/lib/actions/orders.ts`) re-validates the submitted
method server-side against both the settings toggle and (for Online) the
SSLCommerz config — a direct POST bypassing the UI can't place an order
with a disabled method. If both methods end up disabled, checkout shows
an explicit "no payment methods available" message and disables the Place
Order button, rather than silently failing.

## 9. Customers — detail view + sortable/searchable list — DONE (2026-09-06)

- `/admin/customers` is now a table with a search box (name/email/phone)
  and sortable column headers (Customer/name, Orders/count, Joined/date) —
  new reusable `src/components/admin/sort-link.tsx` writes/toggles
  `sort`/`dir` URL params.
- Clicking a row opens a new detail page
  (`/admin/customers/[id]/page.tsx`): contact info, registered-vs-guest
  status, all saved addresses (default one flagged), full order history
  with status/total/date linking to each order's admin detail page, and
  total paid across orders. "Send reset link" moved from the list row to
  this detail page.

`npx tsc --noEmit` and `eslint` clean. **Not yet tested in a live
browser** — no local DB access.

## 10. Forms — save confirmation via snackbar — PARTIALLY DONE (2026-09-06)

Targeted the saves that gave **zero visible feedback** before (no list
change, no dialog, nothing): Settings save (converted to a client
`SettingsForm` component + `useActionState`, mirroring the Policies form),
category rename, and role update (both already client components —
`category-row.tsx`/`role-row.tsx` — so just wrapped the action call with a
try/catch + `toast.success`/`toast.error` inline, no bigger refactor
needed). Policies save already had this from item 20.

**Deliberately left alone for now:** every delete action (already gets a
confirm dialog + the row visibly disappearing — reasonable feedback
already) and every create action (already gets a new visible row in the
list). Adding toasts to all of those too is possible but is a much larger
diff across every remaining admin form for comparatively less benefit —
flag if you want full coverage anyway.

`npx tsc --noEmit` and `eslint` clean. **Not yet tested in a live
browser** — no local DB access.

## 11. Footer — admin-configurable contact/social info — DONE (2026-09-06)

Added a "Footer" section to `/admin/settings` (`SettingsForm`): shop
address, a Google Maps link (pasted "Share" link, shown as a "View on map"
link next to the address — not a live embedded iframe map, to avoid a
Maps API key/CSP complexity; flag if you actually want a real embedded
map), and 4 social links (Facebook, Instagram, YouTube, TikTok — each
independently optional, hidden from the footer when blank). Public footer
(`footer.tsx`) now renders all of this, fed from `src/app/(site)/layout.tsx`
(already fetched settings there for the WhatsApp button). Note:
lucide-react has no brand/social icons in the installed version, so I drew
simple inline SVG glyphs for Facebook/Instagram/YouTube/TikTok instead of
adding a new icon-pack dependency.

`npx tsc --noEmit` and `eslint` clean. **Not yet tested in a live
browser** — no local DB access.

## 12. IMPORTANT — Active Design setting must be Administrator-only — DONE (2026-09-06)

Went with the recommended approach: hardcoded on "is the current user's
role the protected Administrator role," not a new permission key. Added
`isProtectedRole(roleId)` to `src/lib/authz.ts` (shares the same
per-request cache as `getRolePermissions`, refactored both to sit on one
`getRoleInfo` lookup so this didn't cost a second query). The Settings
page now only passes the Landing-page section's data to `SettingsForm`
when `showActiveDesign` is true; for every other role the section doesn't
render at all (not just disabled) — but the form still round-trips the
current landing variant as a hidden input in that case, so a non-Administrator
saving the rest of the Settings form (WhatsApp number, footer links, etc.)
can't accidentally wipe out the current landing-page choice by omitting a
field they never saw.

`npx tsc --noEmit` and `eslint` clean. **Not yet tested in a live
browser** — no local DB access.

## 13. Orders — search & filter (duplicate of #2, kept separate per client's list)

Client listed this again at the end of their message — same as item 2,
noted here so it isn't dropped when splitting into tickets.

---

## 14. Hero section — copy + layout — DONE (2026-09-06)

- **English subtitle** (`dictionary.ts` `commerce.heroSubtitle`) replaced
  with the client's exact new copy. **No Bangla version provided** — the
  Bangla `commerce.heroSubtitle` still has its own (hospital-removed, but
  otherwise original) text, now out of sync with the new English copy.
  Flag if you want a Bangla translation of the new line too.
- **Layout fix** (`promo-hero.tsx`): the photo had `opacity-70` on the
  `<Image>` itself *plus* a gradient overlay that was 85% opaque black
  across most of the frame — between the two, the actual furniture photo
  was barely visible. Removed the image opacity, replaced the heavy
  side-to-side gradient with a lighter one (just enough behind the text
  column for legibility, fading to fully transparent by mid-frame) plus a
  subtle bottom gradient for the CTA row — photo now reads at full
  brightness across most of the frame, text stays legible only where it
  overlaps.

`npx tsc --noEmit` and `eslint` clean. **Not yet checked visually** — no
local DB access, and this is exactly the kind of change that should be
eyeballed in a browser once deployed.

## 15. Bangla tagline change — DONE (already applied before I got to it)

`src/lib/i18n/dictionary.ts` `commerce.heroTitle` (Bangla) was already
`"কাজে আসে এমন আসবাবপত্র।"` by the time I checked — done, nothing further
needed.

## 16. Remove "Hospital" everywhere — DONE (2026-09-06), marketing copy + UI

Client confirmed full removal: *"remove Hospital from everywhere, they
don't work for hospital or make products."* Completed:

- **Marketing copy** (`src/lib/i18n/dictionary.ts`, both languages): every
  hero eyebrow/kicker, the About page (`aboutPage.*`), the `president`
  manifesto block, `commerce.sectorHospital`/`sectorHospitalDesc`,
  `showroom` hero copy, and two "office, facility, or ward" mentions
  (`president.atelierBody` + Bangla) all had "Hospital"/হাসপাতাল/"ward"
  removed or replaced with real remaining categories (e.g. marquee slots
  now read "Reception & Lounge" instead of "Hospital Furniture"). Also
  fixed the footer's own tagline (`footer.tsx`) and the root `<meta
  description>` (`app/layout.tsx`).
- **Components**: `commerce/sectors.tsx` — removed the Hospital sector
  card entirely (not just relabeled), grid now 2 columns instead of 3.
  `showroom/pillars.tsx`, `commerce/category-grid.tsx`, `landing/registry.tsx`,
  `commerce/index.tsx` — only had stale comments mentioning hospital, fixed
  those too.
- **Room selector visibility** (`src/components/site/product-filters.tsx`):
  removed `HEALTHCARE` from the public filter's selectable list. **Left it
  in** `src/components/admin/product-form.tsx`'s room dropdown on
  purpose — removing it there would make the `<select>` silently fall back
  to the first option for any existing HEALTHCARE-tagged product opened
  for editing, corrupting its room on save without anyone touching the
  field. Commented both files explaining the asymmetry.
- **Data model — deliberately NOT touched**: `RoomType.HEALTHCARE` in
  `prisma/schema.prisma` and the seed's "Hospital Furniture" category/
  products are untouched. I have no way to check from here whether any
  real (non-seed) product or past order in the live DB uses `HEALTHCARE` —
  dropping the enum value or deleting that data needs that check first
  (same care as the role-management migration). Everything done here is
  reversible copy/UI-only; the data-layer question is still open if you
  want it addressed too.

`npx tsc --noEmit` and `eslint` clean. **Not yet tested in a live
browser** — no local DB access.
  - Also remove `HEALTHCARE`'s Bangla/English labels from
    `src/lib/i18n/dictionary.ts` (`HEALTHCARE: "Healthcare"` /
    `"হেলথকেয়ার"`) and any product-filter dropdown that lists room types.

## 17. Return/exchange policy image — DONE (2026-09-06), via item 20 below

Turned out the garbled-heading image wasn't actually in this codebase (per
investigation — no policy images anywhere in `src/app`, `public/`, or
`src/lib/settings.ts`). The client separately sent the real, clean Return
Policy text (plus Terms & Conditions, Delivery Policy, Delivery Charges,
Fitting & Installation, Product Disclaimer, Warranty) directly — see item
20, which builds all of this as real, admin-editable text rather than an
image. That resolves both asks here at once: real legible text, and
admin-editable.

## 20. Legal/policy pages — admin-editable content — DONE (2026-09-06)

Client sent real text for: Terms & Conditions, Delivery Policy, Delivery
Charges, Fitting & Installation Policy, Product Disclaimer, Return Policy,
Warranty — asked for all of it in the admin panel and shown on the site,
adding any missing page.

Reused the existing `SiteSetting` key-value table (already in production,
**zero new migration needed**) rather than a new model — extended
`SETTING_KEYS` (`src/lib/settings.ts`) with 4 new content keys. Built:
- `src/lib/policy-content.ts` — the client's text as defaults, shown
  immediately even before an admin edits anything.
- `src/lib/policy-markdown.tsx` — a small, safe renderer (no HTML parsing,
  so admin-entered text can't inject markup) supporting `## heading`
  section breaks, `- ` bullets, and `**bold**`, matching the existing
  `PolicySection`/`PolicyLayout` visual style.
- New page `src/app/(site)/terms/page.tsx` (didn't exist before), added to
  the footer (`footer.tsx` + both i18n dictionaries).
- Updated the existing `delivery`, `returns`, `warranty` pages to pull
  from settings (with the client's content as fallback) instead of
  hardcoded JSX. Delivery Charges + Fitting & Installation folded into the
  `/delivery` page as extra sections (footer only ever linked one
  "Delivery" page). Product Disclaimer folded into the `/terms` page (no
  dedicated footer link existed for a standalone disclaimer page) — flag
  if a separate page is wanted instead.
- New admin page `/admin/policies` (gated on `settings.edit`, nav entry
  added under Configure) — one textarea per page, a short formatting
  cheat-sheet, and a toast confirmation on save (`src/lib/actions/policies.ts`,
  `src/components/admin/policy-form.tsx`) — this one already has the
  snackbar confirmation asked for in item 10.

`npx tsc --noEmit` and `eslint` clean. **Not yet tested in a live
browser** — no local DB access.

## 18. Admin-uploadable branding (icon + logo, with fallback) — DONE (2026-09-06)

Added a "Branding" section to `/admin/settings` (above the rest of the
form, since it saves immediately per-upload rather than on the big Save
button) — two independent uploaders (`src/components/admin/brand-asset-uploader.tsx`):
**Logo icon** (square mark) and **Full logo** (wordmark/lockup), each with
a live preview and a Remove button.

- New storage path: `uploadBrandAsset()` in `src/lib/storage.ts` (mirrors
  the existing product-image upload, saves under
  `public/uploads/branding/{icon|logo}/`, also accepts SVG unlike the
  product uploader), served via a new `/api/admin/upload-brand` route
  gated on `settings.edit` specifically (not the generic "any admin"
  check the product upload route used to have, before I fixed that in
  item 4).
- Two new settings keys (`brandIconUrl`, `brandLogoUrl`) and a
  `saveBrandAsset()` action that persists immediately after a successful
  upload.
- **Resolution order everywhere the mark appears** (public header
  `header.tsx`, admin sidebar `admin-shell.tsx`, admin login page
  `admin/login/page.tsx`): uploaded icon shown next to the existing text
  wordmark → uploaded full logo shown alone (it already contains the
  wordmark) → the original code-drawn `ThroneMark` lockup as the final
  fallback, exactly as before. Each surface keeps its own existing sizing/
  hover styling rather than being replaced by one generic shared
  component, since e.g. the header's icon tile has a hover-rotate
  animation that a generic component would have lost.
- Didn't touch the "president" landing variant's decorative `ThroneMark`
  use (`landing/president/cta.tsx`) — that's a stylized WebGL flagship
  page where swapping in a raster upload would look out of place; flag if
  you want that covered too.

`npx tsc --noEmit` and `eslint` clean. **Not yet tested in a live
browser** — no local DB access.

## 19. Meta Pixel / Facebook Business Manager integration — optional, explained below

Client pasted a guide and asked whether it's correct/doable and what it's
for — answered directly in chat (see conversation), not building yet since
client marked it optional and wants to understand it first. Summary for
the backlog: if they proceed, needs (a) a domain-verification meta tag in
`src/app/layout.tsx`'s `metadata.verification.other`, (b) a Meta Pixel
`<Script strategy="afterInteractive">` snippet with the pixel ID from an
env var, and (c) wiring real events (`AddToCart`, `InitiateCheckout`,
`Purchase`) at the actual cart/checkout/order-confirmation code paths, not
just a page-view-only snippet, or it won't be very useful for ad
targeting. The exact snippet the client pasted has two bugs (wrong pixel
script URL, wrong noscript fallback URL) that would need correcting, not
copy-pasted as-is.

## 22. Admin-editable hero section + rotating background + sitewide font — DONE (2026-09-07)

Client asked for the homepage hero (eyebrow/headline/subtitle, both
buttons' text *and* destination link, and the background photo) to become
admin-editable, with up to 5 photos auto-rotating, plus a less "generic"
sitewide font. Decisions confirmed: scope to the **Commerce** landing
variant only (the one actually in use), font pairing **Cormorant Garamond
(display, already loaded) + Inter (body, replacing Geist Sans)**, and
**no** JS inertia-scroll library — native `scroll-smooth` stays.

- New `/admin/hero` page: text/button fields
  (`src/components/admin/hero-content-form.tsx`) and a photo manager
  (`hero-slide-manager.tsx`, upload/reorder/remove, capped at 5) — both
  save immediately with a toast, no separate "Save" step needed for
  photos. Reuses the existing `SiteSetting` key-value table (new keys
  only) and local-disk upload pattern (`uploadHeroImage` in
  `src/lib/storage.ts`, new `/api/admin/upload-hero` route) — **no schema
  migration needed**, ships immediately.
- `promo-hero.tsx` (Commerce hero) now crossfades through the admin's
  photos every 6s (falls back to the original single photo if none are
  set) with small dot indicators, and every text field/button
  label/button link falls back to the original translated defaults when
  left blank in admin — so an empty `/admin/hero` looks identical to
  before.
- **Limitation:** admin-entered text is a single value shown regardless
  of site language (no separate English/Bangla fields) — building a
  bilingual editing UI for every field was out of scope here. If left
  blank, the existing English/Bangla dictionary text still shows
  correctly per-locale.
- Font: `src/app/layout.tsx` now loads `Inter` instead of `Geist Sans` for
  body/UI text; `Cormorant Garamond` (already loaded) is unchanged for the
  brand wordmark/display serif use.

`npx tsc --noEmit` and `eslint` clean. **Not yet tested in a live
browser** — the client's own dev server is live now though (see chat), so
this one should be checkable immediately.

---

## Not yet scoped

Client noted "I might add more later" — expect more items appended to this
list before work starts.
