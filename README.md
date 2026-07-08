# Woodcraft Furniture

A furniture showcase website with an admin panel, built for a business that
sells wooden, artificial-wood, and leather furniture for home and office.

**Stack:** Next.js (App Router, TypeScript) + Tailwind CSS + Prisma + PostgreSQL
(Supabase) + Auth.js (NextAuth v5), deployed on Vercel directly from this
GitHub repo.

## What's here (Stage 1)

- Public site: landing page, product listing with filters (category,
  material, room, stock), product detail pages, wishlist (stored in the
  browser), and a lead-capture form that reaches the admin panel.
- Admin panel (`/admin`, login-protected): dashboard, product CRUD,
  category CRUD, leads inbox with status tracking, and admin user
  management.
- Database schema (Prisma) for Products, Categories, Product Images,
  Leads, and Admin Users.

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

Create a free [Supabase](https://supabase.com) project (or point at any
Postgres instance), then copy `.env.example` to `.env` and fill in:

- `DATABASE_URL` / `DIRECT_URL` — from Supabase Project Settings > Database
- `AUTH_SECRET` — generate with `npx auth secret`
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` /
  `SUPABASE_SERVICE_ROLE_KEY` — from Supabase Project Settings > API
  (only needed once product image uploads are wired up)

```bash
cp .env.example .env
```

### 3. Run migrations and seed sample data

```bash
npm run db:migrate
npm run db:seed
```

The seed script creates sample categories/products and one admin login:

- Email: `admin@example.com`
- Password: `ChangeMe123!`

Override these via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars
before seeding if you don't want the default in your database.

### 4. Run the app

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login

## Useful scripts

| Command             | What it does                                  |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Start the dev server                           |
| `npm run build`      | Production build                               |
| `npm run lint`       | Lint the codebase                              |
| `npm run db:migrate` | Create/apply a Prisma migration (dev)          |
| `npm run db:deploy`  | Apply migrations (production, run in CI/CD)    |
| `npm run db:studio`  | Open Prisma Studio to browse the database      |
| `npm run db:seed`    | Seed sample categories/products/admin user     |
| `npm run admin:reset` | Create or reset an admin login (see below)    |

## Admin access

- **URL:** `/admin/login` (e.g. `https://your-site.vercel.app/admin/login`).
- **Default login** (only if you ran `npm run db:seed`): `admin@example.com` /
  `ChangeMe123!` — change it immediately.
- **Create or reset a login from the CLI** (works even if you're locked out):
  ```bash
  ADMIN_EMAIL=you@email.com ADMIN_PASSWORD='at-least-8-chars' npm run admin:reset
  ```
  Creates the admin if new, or resets the password if the email already exists.
- **Change your own password in the app:** Admin → **Users** → *Your account*.
- **Manage other admins/staff:** Admin → **Users** (create/remove; you can't
  delete yourself or the last admin).

## Deployment (Vercel + GitHub)

Every push to `main` auto-deploys to production; every branch/PR gets its
own preview URL. Database migrations run automatically on each deploy —
the repo's `vercel-build` script runs `prisma migrate deploy` before
`next build`, so you never migrate by hand.

### First-time setup

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import
   `Sayeed-titan/furniture_ecommerce_with_admin_panel`. Vercel auto-detects
   Next.js — leave the framework preset and build settings as-is.
2. Before the first deploy, open **Settings → Environment Variables** and add
   the variables below (set each for **Production** and **Preview**).
3. Click **Deploy**. On success, open the deployment URL — the public site is
   live; the admin panel is at `/admin/login`.
4. **Seed the first admin + sample data** (one time). Locally, with your
   production `DATABASE_URL` in `.env`, run `npm run db:seed`, or create your
   admin by any means you prefer. Then log in and change the password.
5. (Optional) **Settings → Domains** → add your custom domain.

### Required environment variables

| Variable | Needed for | Notes |
| --- | --- | --- |
| `DATABASE_URL` | app runtime | Supabase **transaction pooler** (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | migrations | Supabase **session pooler** (port 5432) |
| `AUTH_SECRET` | admin login | `npx auth secret` |
| `NEXTAUTH_URL` | admin login | your production URL, e.g. `https://yoursite.vercel.app` |

### Optional environment variables (each feature degrades gracefully if unset)

| Variable | Feature |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET` | product image uploads |
| `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME` | website issue reporting → GitHub |
| `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_EMAIL` | email notifications |

See [Integrations](#integrations-stage-3) for how to obtain each.

No servers to patch or maintain — Vercel and Supabase are both managed
services. The full loop is: **edit → push to GitHub → Vercel builds, migrates,
and deploys**.

## Integrations (Stage 3)

All three are **optional** — each is gated behind env vars and degrades
gracefully when unconfigured, so the site runs fine without any of them.

### Website issue reporting → GitHub

Visitors can submit a bug/feature/change request at `/report` (linked from
the footer). Every submission is saved in the admin panel under **Issues**,
and — when GitHub is configured — also opened as an issue in your repo,
labelled `from-website` + `bug`/`enhancement`/`change-request`/`question`.

- Set `GITHUB_TOKEN` (fine-grained PAT, Issues: read & write), `GITHUB_REPO_OWNER`,
  `GITHUB_REPO_NAME`.
- Without a token, reports are still captured locally; use **Retry sync** on
  the admin Issues page once a token is added to push them to GitHub.

### Email notifications (new leads + issue reports)

When someone submits a lead (wishlist/contact) or an issue report, the
business gets an email. Uses [Resend](https://resend.com) over HTTPS.

- Set `RESEND_API_KEY`, `EMAIL_FROM` (a verified sender), `NOTIFY_EMAIL`.
- Without these, notifications are silently skipped — submissions still save.

### Product image uploads (Supabase Storage)

The admin product form lets you upload an image file (or keep pasting a URL).

- Create a **public** Supabase Storage bucket named `product-images` (or set
  `SUPABASE_STORAGE_BUCKET`), and set `SUPABASE_SERVICE_ROLE_KEY`.
- Without these, the form falls back to the URL field.

## Project structure

```
src/
  app/
    (site)/            Public-facing pages (home, products, wishlist, contact)
    admin/              Admin panel (login + protected dashboard routes)
    api/                 Route handlers (auth, leads, products lookup)
  components/
    site/               Public site UI (header, footer, product card, filters, wishlist)
    admin/              Admin UI (sidebar, topbar, product form)
    ui/                  Shared design-system primitives (button, card, badge, input...)
  lib/
    actions/             Server actions (products, categories, leads, users)
    prisma.ts            Prisma client singleton
  auth.ts                Auth.js configuration
  proxy.ts               Route protection for /admin/*
prisma/
  schema.prisma          Data model
  seed.ts                 Sample data seeder
```

## Roadmap

- **Stage 1 (this stage):** structure, data model, admin auth, working
  end-to-end flows for products, wishlist, leads, and admin CRUD.
- **Stage 2:** polish the landing page and products page UI/UX (modern
  design pass, animations, responsive refinement).
- **Stage 3 (done):** the integrations discussed — website issue reporting
  that opens GitHub issues, email notifications on new leads and issue
  reports, and product image uploads to Supabase Storage. See
  [Integrations](#integrations-stage-3).
- **Stage 4 (done):** full admin-panel redesign — a cohesive, responsive
  design system across every page, multi-image product galleries, product
  search + filters, category rename, lead status filters, delete
  confirmations, and user guards.
- **Stage 5 (in progress):** business power features — an admin **Settings**
  page to switch the live landing-page design and set a WhatsApp/phone
  number without code, a floating **Chat on WhatsApp** button on the public
  site, plus **lead notes** and **CSV export**.

Each stage ends with a review and a punch list of suggested improvements
before moving to the next one.
