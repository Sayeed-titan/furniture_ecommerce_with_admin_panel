# Deploying the role-management migration to production

This is a one-time checklist for shipping the admin role/permissions feature
(`prisma/migrations/20260906130000_add_role_management/`) to the live site
without breaking it. Read the whole thing once before starting — the steps
must happen close together, not spread across a day.

## Why this needs care

This migration **drops the old `role` column** on `AdminUser` after moving
everyone into the new `Role` table. Old code and new code cannot both run
against the schema at the same time:

- Old code + migrated DB → crashes (queries a `role` column that's gone).
- New code + un-migrated DB → crashes (queries a `Role` table/`roleId`
  column that doesn't exist yet).

So the DB migration and the code deploy have to happen back-to-back, not
independently. Hostinger's build does **not** run migrations automatically
(this was disabled on purpose after a past incident — see
`docs/` incident notes / project memory `hostinger-deploy-missing-migration-incident`).
Migrations are always run by hand, from a local Windows machine, against the
production `DATABASE_URL`.

## Prerequisites

- [ ] All role-management code is committed (schema, `src/lib/permissions.ts`,
      `src/lib/authz.ts`, `src/middleware.ts`, updated actions/pages,
      `scripts/reset-admin.ts`, `prisma/seed.ts`).
- [ ] `npx tsc --noEmit` and `npx eslint .` are clean.
- [ ] You have the production `DATABASE_URL` (Hostinger MySQL) at hand.
- [ ] You have SSH access to the Hostinger box (see project memory
      `hostinger-ssh-access`) in case you need to check logs.

## Step 1 — Back up the production database

Non-negotiable, because the migration drops a column. This is the actual
undo button if anything goes wrong.

```powershell
mysqldump -h srv1158.hstgr.io -u u565363010_app_user -p u565363010_president_db > president_db_backup_$(Get-Date -Format yyyyMMdd_HHmm).sql
```

Confirm the resulting `.sql` file is non-empty and looks like real SQL
before continuing.

## Step 2 — Review the migration SQL one more time

Open `prisma/migrations/20260906130000_add_role_management/migration.sql`
and eyeball table/column casing (`AdminUser`, `Role`) against
`prisma/schema.prisma` — production MySQL is case-sensitive Linux, and a
casing mismatch is exactly what caused the last deploy incident. This
migration was hand-written (not generated against a live DB), so this
review step matters more than usual.

## Step 3 — Make sure the new code is ready to go live immediately after

Have your deploy mechanism (push to whatever branch/remote triggers the
Hostinger build) staged and ready to fire the moment the migration finishes.
Don't trigger it yet.

## Step 4 — Run the migration against production

From local Windows, with the production connection string:

```powershell
$env:DATABASE_URL = "mysql://u565363010_app_user:<password>@srv1158.hstgr.io:3306/u565363010_president_db"
npx prisma migrate deploy
Remove-Item Env:\DATABASE_URL
```

Watch the output — it should apply `20260906130000_add_role_management`
cleanly. If it errors, stop here and do not deploy new code; restore from
the Step 1 backup if the error left things partially applied.

At this point existing `AdminUser` rows are already backfilled into
Administrator/Staff roles automatically — nobody's login breaks — but the
**old code running on the server will now error** until the new code is
live, so move straight to Step 5.

## Step 5 — Deploy the new code immediately

Trigger the Hostinger build/deploy right away. Once it completes, bounce
the app process if it doesn't restart on its own:

```bash
touch ~/domains/presidentfurniturebd.com/hbuilds/current/nodejs/tmp/restart.txt
```

## Step 6 — Verify

- [ ] Check the runtime log for errors:
      `~/domains/presidentfurniturebd.com/hbuilds/current/nodejs/console.log`
      (via SSH — the build log looking clean is not enough, per the past
      incident).
- [ ] Log into `/admin/login` with your existing admin account — confirm
      it signs in and shows "Administrator" in the header.
- [ ] Open `/admin/roles` — confirm "Administrator" (protected) and "Staff"
      roles both appear with their permissions.
- [ ] Spot-check one gated page (e.g. `/admin/products`) still loads and the
      New/Delete buttons still show for your Administrator account.
- [ ] Run `npm run admin:reset` once (with `ADMIN_EMAIL`/`ADMIN_PASSWORD` env
      vars) if you want to confirm the reset script still upserts correctly
      against production — optional, only if you're unsure.

## If something goes wrong

Restore the Step 1 backup:

```powershell
mysql -h srv1158.hstgr.io -u u565363010_app_user -p u565363010_president_db < president_db_backup_<timestamp>.sql
```

Then redeploy the *previous* code version so it matches the restored
(pre-migration) schema again.
