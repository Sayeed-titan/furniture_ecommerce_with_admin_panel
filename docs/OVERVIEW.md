# Woodcraft Furniture — Application Overview

A bilingual **furniture showcase website + self-run admin panel**, built as a
single deployable Next.js app. It sells ready-made wooden, artificial-wood, and
leather furniture **and** custom on-site woodwork (fitted built-ins, permanent
interiors, custom doors, millwork).

**Business model — showcase to lead, not checkout.** There is no cart or
payment. Visitors browse, save pieces to a wishlist, and send their details;
those become **leads** the sales team closes off-site. The client runs
everything — products, prices, stock, leads, even the homepage design — from
the admin panel, without touching code.

> This is the technical + business overview. For a short, non-technical version
> to share with the client, see [`CLIENT-BRIEF.md`](./CLIENT-BRIEF.md).

---

## Technology

| Area | Choice |
| --- | --- |
| Framework | **Next.js 16** — App Router, React Server Components, Turbopack |
| Language | **TypeScript** |
| Styling | **Tailwind CSS v4** + a small in-house component set |
| Database | **PostgreSQL** on Supabase, via the **Prisma** ORM |
| Auth | **Auth.js** (NextAuth v5) — credentials, JWT sessions, role-based |
| Images | **Supabase Storage** — product image uploads |
| Email | **Resend** — lead & issue notifications |
| Issues | **GitHub REST** — website requests become repo issues |
| Hosting | **Vercel** — push to GitHub → auto-migrate & deploy |
| i18n | **English & বাংলা** with dedicated Bengali fonts |

All three external integrations run over plain `fetch` (no extra SDKs) and each
is **optional** — the app runs fine with none of them configured.

---

## Pages & routes

### Public site
| Route | Purpose |
| --- | --- |
| `/` | Landing — one of four designs, admin-switchable |
| `/products` | Catalog with filters & sort |
| `/products/[slug]` | Product detail + image gallery |
| `/wishlist` | Saved pieces → send as a lead |
| `/contact` | Enquiry / lead form |
| `/report` | Report an issue or request a change |

### Admin panel (login required)
| Route | Purpose |
| --- | --- |
| `/admin` | Dashboard — stats & recent activity |
| `/admin/insights` | Analytics — views, top products, lead pipeline |
| `/admin/products` (`/new`, `/[id]`) | Product CRUD + galleries + search |
| `/admin/categories` | Categories — rename & safe delete |
| `/admin/leads` (`/export`) | Leads inbox + notes + CSV export |
| `/admin/issues` | Website requests + GitHub sync |
| `/admin/users` | Admins & staff + passwords |
| `/admin/settings` | Landing design, WhatsApp, phone |

### API routes
`/api/leads` · `/api/issues` · `/api/products` · `/api/track/view` · `/api/admin/upload` · `/api/auth/[...nextauth]`

---

## Data model

| Model | What it holds | Key fields |
| --- | --- | --- |
| `AdminUser` | Panel logins | name · email · passwordHash · role |
| `Category` | Product grouping | name · slug |
| `Product` | A catalog piece | name · slug · description · price · compareAtPrice · material · room · stockStatus · stockQty · featured · viewCount |
| `ProductImage` | Gallery images | url · alt · position (0 = primary) |
| `Lead` | A sales enquiry | name · email · phone · message · notes · status |
| `LeadItem` | A wishlisted product on a lead | leadId · productId |
| `IssueReport` | A request raised from the site | type · title · body · reporter · githubIssueUrl · syncError |
| `SiteSetting` | Admin-editable config | key · value |

**Enums**

- **Material:** Solid wood · Engineered wood · Artificial wood · Leather · Fabric · Metal
- **Room:** Living · Bedroom · Dining · Office · Outdoor · Kitchen
- **Stock:** In stock · Low stock · Out of stock · Made to order
- **Lead status:** New → Contacted → Qualified → Closed won / Closed lost
- **Issue type:** Bug · Feature · Change · Question

---

## The public site

- **Four landing designs**, switchable live from the admin (no redeploy).
- **Catalog** with text **search**, filters (category, material, room, stock) and sort (newest, price).
- **Product detail** pages with an image gallery and **related products**.
- **Wishlist** stored in the browser → send it and it becomes a lead.
- **Contact / enquiry** form feeding the admin inbox.
- **English / বাংলা** toggle with proper Bengali fonts.
- **Report-an-issue** form that opens a GitHub issue.
- Floating **"Chat on WhatsApp"** button (shown when a number is set).
- Responsive, mobile-first, and accessible.

It also communicates the **two-sided business** — buy ready-made furniture *or*
commission custom on-site woodwork — so it reads as a workshop, not just a shop.

---

## The admin panel

- **Dashboard** — live counts (products, categories, leads, unsynced issues) plus recent leads and recent requests.
- **Insights** — product views, most-viewed and most-enquired products, leads in the last 30 days, and a lead-status pipeline.
- **Products** — create/edit/delete with confirmation, list search & filters, and **multi-image galleries** (add by URL or upload, reorder, set the primary shot).
- **Categories** — add and rename inline; delete is blocked while a category still holds products.
- **Leads** — filter by status, add private internal notes, click-to-email/call, and **export all leads to CSV**.
- **Issue reports** — every website request lands here and, when GitHub is on, opens as a repo issue, with sync status and a retry.
- **Users & access** — add admins/staff, change your own password, with guards (can't delete yourself or the last admin).
- **Settings** — switch the live homepage design and set the WhatsApp / phone numbers.

One cohesive, responsive design system across every screen, with a mobile drawer
and status colour used to surface what needs attention.

---

## Integrations (all optional, all graceful)

| Integration | What it does | Env |
| --- | --- | --- |
| **GitHub issues** | The site's "Report an issue" form opens a labelled repo issue — new requests become trackable, billable work | `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME` |
| **Email alerts** | New leads and new requests email the business immediately (Resend) | `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_EMAIL` |
| **Image storage** | Product photos upload to a public Supabase bucket from the admin | `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET` |

Each is off until its keys are set, and degrades gracefully: a missing GitHub
token still saves the request locally; a missing email key just skips the alert.

---

## The lead workflow

1. **Browse & save** — a visitor explores the catalog and hearts pieces into a wishlist.
2. **Send details** — they submit the wishlist or the contact form (name, phone, email).
3. **Lead lands** — it appears in the admin Leads inbox and an email alert goes out.
4. **Work it** — staff set a status, add notes, reach out by WhatsApp/call, and can export to CSV.
5. **Change requests** — anything new the client wants goes through the Report form → a GitHub issue → scoped, billable work.

---

## Build & deploy cycle

```
edit → push to GitHub → Vercel runs `prisma migrate deploy` → builds → live
```

- Every push to `main` auto-deploys to production; every branch gets a preview URL.
- Migrations run automatically on each deploy (`vercel-build`), so there's no manual step.
- Full setup + environment checklist is in the [root README](../README.md).

---

## Build stages

| Stage | Status | Scope |
| --- | --- | --- |
| 1 — Foundation | Done | Stack, data model, admin auth, deploy wiring |
| 2 — Public showcase | Done | Landing designs, catalog & filtering, product pages, wishlist, EN/বাংলা |
| 3 — Integrations | Done | GitHub issue reporting, email notifications, image uploads |
| 4 — Admin redesign | Done | Full design system, multi-image galleries, search, CRUD guards |
| 5 — Business power features | Done | Landing switch, WhatsApp, lead notes & CSV, public search, related products, Insights analytics |

*Reflects the state as of July 2026.*
