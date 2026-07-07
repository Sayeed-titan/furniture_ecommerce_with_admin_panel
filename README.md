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

## Deployment

1. Push this repo to GitHub (already done).
2. Create a [Vercel](https://vercel.com) project and import the repo —
   every push to `main` auto-deploys, every branch/PR gets a preview URL.
3. In Vercel's project settings, add the same environment variables from
   `.env` (Production + Preview).
4. Add a Vercel "Build Command" override if you want migrations to run on
   deploy, e.g. `npm run db:deploy && npm run build`.
5. Point your domain at the Vercel project once you're happy with a
   preview.

No servers to patch or maintain — Vercel and Supabase are both managed
services.

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

Each stage ends with a review and a punch list of suggested improvements
before moving to the next one.
