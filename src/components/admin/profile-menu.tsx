"use client";

import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { KeyRound, LogOut, ChevronDown } from "lucide-react";
import { signOutAdmin } from "@/lib/actions/auth";

export function ProfileMenu({
  userName,
  userEmail,
  role,
}: {
  userName?: string | null;
  userEmail?: string | null;
  role?: string | null;
}) {
  const initials = (userName ?? "A")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-neutral-100"
        >
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-sm font-medium text-neutral-900">{userName}</p>
            <p className="text-xs text-neutral-500">
              {userEmail} {role ? `· ${role}` : ""}
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
            {initials}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-56 rounded-md border border-neutral-200 bg-white p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <div className="px-2 py-1.5">
            <p className="text-xs text-neutral-500">Signed in as</p>
            <p className="truncate text-sm font-medium text-neutral-900">{userEmail}</p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-neutral-100" />
          <DropdownMenu.Item asChild>
            <Link
              href="/admin/users"
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-neutral-700 outline-none hover:bg-neutral-100 focus:bg-neutral-100"
            >
              <KeyRound className="h-4 w-4" /> Change password
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-neutral-100" />
          <form action={signOutAdmin}>
            <DropdownMenu.Item asChild>
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-neutral-700 outline-none hover:bg-neutral-100 focus:bg-neutral-100"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </DropdownMenu.Item>
          </form>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
