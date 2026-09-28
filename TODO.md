# TODO — reported issues

Running backlog from the admin's issue review. Each item has root cause evidence where already
investigated; items without a file:line haven't been dug into yet.

## Open

Everything from the original issue review is done — see Done below. Only the SEO track (its own
initiative) and anything reported in a future session remain.

## SEO overhaul (2nd big task — separate track)

Quick scan confirms this is currently close to a blank slate:

- [ ] No `src/app/sitemap.ts` or `src/app/robots.ts` — neither Next.js metadata route exists.
- [ ] No `generateMetadata` anywhere in `(site)` — homepage ([page.tsx](src/app/(site)/page.tsx)) and
      product detail ([products/\[slug\]/page.tsx](src/app/(site)/products/[slug]/page.tsx)) ship
      zero per-page `<title>`/description/Open Graph tags.
- [ ] No JSON-LD structured data (`Product`, `Organization`, `BreadcrumbList`) anywhere — for an
      e-commerce catalog this is the single highest-leverage gap (rich results, price/availability
      snippets).
- [ ] Canonicals, hreflang (site already has bn/en via [[dark-mode-architecture]]'s i18n neighbor —
      `src/lib/i18n`), and Core Web Vitals haven't been audited yet.

Recommend running the dedicated `seo-master` agent for a full audit + prioritized roadmap when
ready to start — it's scoped exactly for Next.js App Router e-commerce SEO.

## Migration note (applies to every "Needs a schema migration" item above)

Local dev has no working `DATABASE_URL` — see [[db_migration_plan]]. Any new column gets a
hand-written `migration.sql` (same as the pending
`20260906130000_add_role_management`/`20260906140000_add_shipping_and_materials` migrations), but
someone with real Hostinger DB access has to run `npx prisma migrate deploy` before the feature
actually works in production.

## Done

- [x] Admin button style is now config-based (color, ALL CAPS toggle, icon gap) — Settings page,
      applies live across every admin form + the delete-confirmation dialog + list-page action
      buttons (Products/Categories/Materials/Shipping/Roles).
- [x] Cancel button added next to Save on the product form and the role edit form; category/
      material inline rename rows already had one (now labeled, not icon-only).
- [x] **Stock desync bug fixed.** `stockStatus` is no longer an independently-editable dropdown —
      [product-form.tsx](src/components/admin/product-form.tsx) now only has a "Made to order"
      checkbox; every other status is derived from quantity vs. reorder level via
      `deriveStockStatus()` in [src/lib/stock.ts](src/lib/stock.ts), shared by `createProduct`,
      `updateProduct`, and `adjustStock` — so the admin can no longer save a status that disagrees
      with the actual quantity.
- [x] **Stock In (GRN) page added** at `/admin/inventory` — record production batches coming into
      inventory (optional reference/note + product+quantity lines), applies to `stockQty` via the
      same `deriveStockStatus()`, keeps a history log. New `StockReceipt`/`StockReceiptItem` tables
      — **migration written but not applied**, see the migration note above (same blocker).
      New `stock.view`/`stock.create` permissions — existing custom roles won't see the nav item
      until someone with `users.edit` grants it on their role.
- [x] **Admin button dark/light theming fixed.** Root cause: `--admin-btn-primary` fell back to a
      literal hex (`#171717`), but the button text still used `text-white`, which itself inverts to
      near-black under `.dark` (see [[dark-mode-architecture]]) — so in dark mode the text went
      near-invisible against a background that never changed, and the fixed near-black button also
      blended into the near-black dark-mode page background. Fix: default (no custom color) now
      resolves to `var(--color-neutral-900)`/`var(--color-white)`, the same pairing the rest of the
      app uses, so it fully inverts with the theme. Custom color is now an explicit opt-in checkbox
      in Settings ("Use a custom primary color") — when on, text is pinned to the always-white
      `onmedia` token instead of the inverting `white`, so a picked brand color stays readable in
      both themes. New setting: `adminButtonCustomColorEnabled`.
- [x] **Product code generator built** — token pattern engine
      ([product-code.ts](src/lib/product-code.ts)): `{BRAND}`, `{CATEGORY}`, `{SEQ}`/`{SEQ:n}`,
      `{YEAR}`/`{YY}`; anything else typed (e.g. "V1") passes through as literal text, no dedicated
      "version" token needed. `Category.shortCode` (admin-editable on `/admin/categories`, auto-
      derived from the name if left blank, self-disambiguates on collision) + `Category.lastSeq`
      (atomically incremented per category) + `Product.code` (nullable, `@unique` — the real
      uniqueness guard). Settings page has brand/pattern fields with a live preview. Product form has
      an optional code field — blank auto-generates, typing anything overrides. Shown in the admin
      products list and on the public product page. **Migration applied to the local dev DB**
      (backfilled real shortCodes for all 8 existing categories: CT/HF/IR/OC/OD/RL/SF/WS) —
      production still needs `prisma migrate deploy` run there separately. Verified end-to-end
      against the real dev DB (atomic sequence: `PF-OC-001` → `PF-OC-002`; literal-text pattern:
      `PF-SC-007-V1`; year token: `PF-SC-2026-0007`) — not yet checked in a live browser (blocked by
      a permission classifier this session).
- [x] **Footer map is now a live embedded Google Map**
      ([footer.tsx](src/components/site/footer.tsx)) — a keyless `output=embed` iframe keyed off
      the shop address text (not the pasted Share link, which can be a shortened URL Google won't
      allow in an iframe), with the original link kept below as "Open in Google Maps."
- [x] **Footer credit line added** — "Design & developed by Mediklaud" linking to
      https://mediklaudltd.com/, at the very bottom of the footer.
- [x] **Checkout email now mandatory + notification-on-invalid.** `guestEmail` was the only ungated
      shipping field (labeled "optional") — now `required` client-side and validated server-side too
      ([orders.ts](src/lib/actions/orders.ts)), guest or signed-in. Added a shared pattern (an
      `onInvalidCapture` handler on the form) so the first empty required field still gets native
      browser focus *and* a `sonner` toast naming the field — was previously silent beyond the
      native tooltip.
- [x] **Product form mandatory fields now marked + notified.** Added a red `*` next to every
      already-`required` label (Name, Description, Price, Category, Material, Setting, Quantity) and
      reused the same invalid-field toast pattern from checkout
      ([product-form.tsx](src/components/admin/product-form.tsx)).
- [x] **Product name is now a link** in the admin products list
      ([products/page.tsx:92-107](src/app/admin/(dashboard)/products/page.tsx:92)) — the whole
      thumbnail+name cell links to the edit page, not just the Edit icon.
- [x] **Admin header profile menu added** ([profile-menu.tsx](src/components/admin/profile-menu.tsx))
      — clicking the name/avatar now opens a dropdown (Radix) with a link to change password
      (reuses the existing form on `/admin/users`) and Sign out. New dependency:
      `@radix-ui/react-dropdown-menu`.
- [x] **Policy pages now use a rich-text editor** (Tiptap, restricted to heading/bullet-list/bold —
      nothing else, so content can't drift from what the storefront renderer supports) instead of a
      typed `##`/`-`/`**bold**` syntax in a plain textarea. New dependency: `@tiptap/react` +
      `@tiptap/starter-kit` + `@tiptap/pm`.
- [x] **Real Trending flag.** `Product.isTrending` (checkbox on the product form) replaces the old
      "just reuses featured, sorted by recency" behavior. Homepage now queries `isTrending: true`
      ordered by `viewCount desc`. Added a `trendingProducts` field to `LandingPageData`
      ([types.ts](src/components/site/landing/types.ts)) separate from `featuredProducts` — only the
      Immersive variant's `TrendingCarousel` consumes it, every other variant untouched.
- [x] **Homepage category curation** — `Category.showOnHome` (default true, non-breaking),
      `Category.order`, `Category.imageUrl`. Homepage query filters + orders by these. Admin
      `/admin/categories` rewritten as a client `CategoryList` — drag-and-drop *and* keyboard-operable
      Up/Down buttons (real `<button>`s, no custom ARIA needed), both call a plain callable
      `reorderCategories()` server action. Category image is a pasted URL field, not an upload widget
      (kept deliberately simple). Wired into the live Commerce landing variant's category grid
      ([commerce/index.tsx](src/components/site/landing/commerce/index.tsx)) — that component already
      had full `imageUrl` support built in, just never had real data to feed it; admin image now takes
      priority over the old "first product's photo" fallback.
- [x] **Searchable category/material dropdowns** — new `Combobox` component
      ([combobox.tsx](src/components/ui/combobox.tsx), Radix Popover + `cmdk`), drop-in replacement
      for a native `<select>` inside a plain form (renders a hidden input, no server-action changes
      needed). Used for both the Category and Primary material fields on the product form.
- [x] **Material multi-select.** Kept the existing required `materialId` (primary material — every
      current reader of `product.material` across the storefront is untouched) and *added*
      `Product.materials` (implicit many-to-many to `Material`) for extras, e.g. a steel-body chair
      with a leather seat. New checklist on the product form ("Additional materials"), shown
      alongside the primary material on the public product spec table
      ([product-spec-table.tsx](src/components/site/product-spec-table.tsx)).
- [x] All four of the above verified end-to-end against the real local dev DB (reorder round-trip,
      showOnHome filter, isTrending query, primary+additional materials on a real product) — not
      checked in a live browser (blocked by a permission classifier this session). New dependencies:
      `cmdk`, `@radix-ui/react-popover`. **Migration applied to the local dev DB** — production still
      needs `prisma migrate deploy` run there separately.
- [x] **Category image is now a real upload**, not a pasted URL —
      [category-image-field.tsx](src/components/admin/category-image-field.tsx), new
      `/api/admin/upload-category` route (gated on `categories.edit`) + `uploadCategoryImage()` in
      [storage.ts](src/lib/storage.ts). Uploading just fills the row's existing `imageUrl` form field
      — actual save still happens on that row's own Save button, same as before.
- [x] **Every growing dropdown app-wide is now searchable.** Generalized `Combobox`
      ([combobox.tsx](src/components/ui/combobox.tsx)) to support a controlled mode (`value`/
      `onValueChange`), not just form mode — let `FilterSelect` (the shared component behind every
      admin list's category/status filter, including the Products page's category filter) use it
      instead of a native `<select>`, with no change to how any of its callers work.
- [x] **Product-picker dropdowns show a thumbnail + a larger hover preview** — new
      [product-combobox.tsx](src/components/ui/product-combobox.tsx), wired into the Stock In line
      items (the only "pick a product from a list" UI in the app right now). Fixes picking the wrong
      one of two similarly-named products by sight, not just by (possibly ambiguous) name.
- [x] **Additional materials is now a searchable multi-select** (tag chips, not a checkbox grid) —
      new [multi-combobox.tsx](src/components/ui/multi-combobox.tsx), same `formData.getAll(name)`
      read on the server so no action code changed. Scales to 20+ materials without becoming an
      unreadable wall of checkboxes.
