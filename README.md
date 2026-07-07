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
- **Stage 3:** everything else discussed — product image uploads,
  GitHub-issue integration for change requests raised from the site,
  email notifications on new leads, etc.

Each stage ends with a review and a punch list of suggested improvements
before moving to the next one.
