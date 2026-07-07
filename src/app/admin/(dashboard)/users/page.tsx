import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser, deleteUser } from "@/lib/actions/users";

export const metadata = { title: "Users" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Admin Users</h1>

      <form action={createUser} className="mt-6 space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="font-medium">Add a new user</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" minLength={8} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              defaultValue="STAFF"
              className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm"
            >
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
        </div>
        <Button type="submit">Create user</Button>
      </form>

      <ul className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
        {users.map((u) => (
          <li key={u.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium">
                {u.name} <span className="text-xs text-neutral-400">({u.role})</span>
              </p>
              <p className="text-sm text-neutral-500">{u.email}</p>
            </div>
            <form action={deleteUser}>
              <input type="hidden" name="id" value={u.id} />
              <Button type="submit" variant="ghost" size="sm">
                Delete
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
