import { signOut } from "@/auth";

export function AdminTopbar({ userName }: { userName?: string | null }) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <span className="text-sm text-neutral-500">
        Signed in as <span className="font-medium text-neutral-900">{userName}</span>
      </span>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/admin/login" });
        }}
      >
        <button type="submit" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          Sign out
        </button>
      </form>
    </div>
  );
}
