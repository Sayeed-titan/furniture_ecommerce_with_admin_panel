# Migrating the database off Supabase → self-hosted Postgres on a Windows Server VM

> **Superseded 2026-09-03**: decided to move to MySQL on the Hostinger Business
> plan instead (free, same box the app is deployed on). `prisma/schema.prisma`
> now targets `mysql`, not `postgresql` — the plan below no longer applies.
> Kept for history only.

Status: **planned, not started**. Written 2026-09-02. Prisma/schema stays
identical throughout — this is a connection-string swap + data copy, not an
ORM change.

Current connection (from `.env`): Supabase pooled Postgres —
`DATABASE_URL` on port 6543 (`pgbouncer=true`), `DIRECT_URL` on port 5432,
both at `aws-0-ap-southeast-1.pooler.supabase.com`.

## 0. Decide how Vercel reaches the VM (decide first)

The app deploys on Vercel (serverless, rotating outbound IPs). Two options:

- **Public port + hardening** — expose Postgres on the VM's public IP,
  require SSL, strong password, IP-allowlist what's practical. Simpler,
  weaker.
- **Tunnel (Cloudflare Tunnel / WireGuard)** — no public DB port; a
  connector on the VM makes it reachable. Safer, more setup.

Default plan below assumes option 1 (public + SSL) unless told otherwise.

## 1. Open Postgres on the VM to remote connections

On the Windows Server VM (PowerShell):

```powershell
Get-Service postgres*        # confirm exact service name/version
Get-NetConnectionProfile     # confirm which firewall profile the NIC is on
```

- `postgresql.conf` → `listen_addresses = '*'`
- `pg_hba.conf` → add a `host` line **above** any catch-all:
  `host  <dbname>  <appuser>  0.0.0.0/0  scram-sha-256`
  (or a tighter IP range for the allowlist route)
- Firewall rule matching the **actual** NIC profile:
  ```powershell
  New-NetFirewallRule -DisplayName "Postgres 5432" -Direction Inbound -Protocol TCP -LocalPort 5432 -Action Allow -Profile Domain,Private
  ```
- Restart: `Restart-Service postgres-x64-<ver>`
- Verify, don't assume: connect and run `SHOW listen_addresses;` — a
  config edit that silently didn't take effect is the most common failure.

## 2. Create the app's database + role

```sql
CREATE ROLE app_user WITH LOGIN PASSWORD '<strong-generated-password>';
CREATE DATABASE president_furniture OWNER app_user;
```

## 3. Handle Vercel's connection pattern

Supabase's pooled URL was doing real work — serverless functions open many
short-lived connections and a single Postgres instance runs out of slots
fast. Install **PgBouncer** on the VM in front of Postgres (transaction
pooling mode) and mirror the current two-URL setup:

- `DATABASE_URL` → PgBouncer's port, `?pgbouncer=true&connection_limit=1`
- `DIRECT_URL` → Postgres port 5432 directly, for `prisma migrate deploy`

`prisma/schema.prisma`'s `datasource db` block stays unchanged — only the
two env values move.

## 4. Copy the data over

```bash
pg_dump --format=custom --no-owner --no-acl "<supabase-direct-url>" -f president_furniture.dump
pg_restore --no-owner --no-acl -d "postgresql://app_user:<pw>@<vm>:5432/president_furniture" president_furniture.dump
```

Confirm schema matches first (or run `prisma migrate deploy` against the
empty new DB, then restore with `--data-only`).

## 5. Cut over

- Update `DATABASE_URL` / `DIRECT_URL` in Vercel → Settings → Environment
  Variables (Production + Preview), and in local `.env`.
- Redeploy, then smoke-test: home page loads, `/admin` login works, a
  product page loads (reads), submit a test lead (writes).
- Keep the Supabase project alive read-only for a few days as rollback
  before decommissioning it.

## Known gotchas

- `pg_hba.conf` typos (wrong column count, leftover `trust` auth from local
  testing) fail silently until a connection is actually attempted.
- Firewall rule applied to the wrong profile (`Public` vs `Domain/Private`)
  — looks configured, still blocks traffic.
- No SSL: add `sslmode=require` to both connection strings once the VM has
  a cert (`sslmode=prefer` as an interim step).
- Checked: this project uses plain `@prisma/client` with no driver adapter
  and no custom Postgres schema (`public` only), so the `@prisma/adapter-pg`
  custom-schema pitfall some setups hit does not apply here.
