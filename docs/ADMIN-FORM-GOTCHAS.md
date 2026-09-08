# Admin form gotchas — read before building any new admin mutation

Two independent bugs caused the "update order status does nothing until I
reload" report (2026-09-06). Both apply to *every* admin form in this
codebase, not just that one — read this before adding a new save/update
action or a new `<select>`/`<input>` bound to server data.

## Gotcha 1 — `revalidatePath` doesn't refresh the current page here

This project runs a modified Next.js (see `AGENTS.md`) where every admin
page is `export const dynamic = "force-dynamic"` and reads data straight
from Prisma — there's no Next.js cache entry on those routes for
`revalidatePath` to invalidate. Per this project's own docs
(`node_modules/next/dist/docs/01-app/02-guides/server-actions.md`), a
Server Action's response only carries a fresh re-render of *the current
route* when it invalidates something Next.js actually cached. Calling
`revalidatePath` on a `force-dynamic` route is a no-op for that purpose —
the mutation itself still succeeds, but the page you're looking at won't
visibly update until a later full navigation/reload.

**Fix:** call `refresh()` from `next/cache` in every mutating action, in
addition to any `revalidatePath` calls (those still matter for *other*
sessions' next navigation to the same path — keep both).

```ts
"use server";
import { revalidatePath, refresh } from "next/cache";

export async function updateSomething(id: string, formData: FormData) {
  await prisma.something.update({ where: { id }, data: { ... } });
  revalidatePath("/admin/somethings"); // other sessions, next visit
  refresh(); // THIS session, right now
}
```

Every action in `src/lib/actions/*.ts` was already updated to do this as
of 2026-09-06 (see `docs/TODO-FEATURE-REQUESTS.md` item 1). Any *new*
mutating action added later needs the same `refresh()` call — it's easy to
copy an existing action as a template and forget it, since the action
still "works" (the DB write succeeds) without it; only the instant-UI-
update part silently doesn't.

## Gotcha 2 — uncontrolled `<select>`/`<input defaultValue>` can't reflect a refresh

Even with `refresh()` working, a form field using `defaultValue` (React's
"uncontrolled input" pattern — used everywhere in this admin, e.g. status
dropdowns, the Settings landing-variant dropdown) only applies that value
the *first* time the element mounts. On every later re-render — including
a correctly-refreshed one — React reuses the same DOM node and does not
reapply `defaultValue`. So the field can be structurally incapable of
showing a change, independent of whether the backend refresh works.

**Fix:** give the element a `key` tied to the value it's displaying, so
React remounts it (and reapplies `defaultValue`) whenever that value
actually changes:

```tsx
<select key={order.status} name="status" defaultValue={order.status}>
  {/* ... */}
</select>
```

Already fixed on: the order-status dropdown
(`orders/[id]/page.tsx`), the lead-status dropdown (`leads/page.tsx`), and
the Settings "Active design" dropdown (`settings/page.tsx`). Any *new*
`defaultValue`-based field bound to server data needs the same treatment —
check for this in review, since it's an easy thing to copy-paste forward
without noticing it's missing.

## Checklist for any new admin save/update form

- [ ] Server action calls `refresh()` (not just `revalidatePath`).
- [ ] Any `defaultValue`-based field has a `key` tied to the value it
      displays.
- [ ] Tested by submitting the form *without* a manual reload afterward —
      that's the only way to actually catch either of these; a reload
      masks both bugs.
