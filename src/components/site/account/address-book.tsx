"use client";

import { useState } from "react";
import type { Address } from "@prisma/client";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAddress, deleteAddress } from "@/lib/actions/addresses";

export function AddressBook({ addresses }: { addresses: Address[] }) {
  const [adding, setAdding] = useState(addresses.length === 0);

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="flex items-start justify-between gap-4 rounded-xl border border-neutral-200 p-4"
        >
          <div className="text-sm">
            <p className="font-medium text-neutral-900">
              {address.recipientName}
              {address.isDefault && (
                <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                  Default
                </span>
              )}
            </p>
            <p className="mt-1 text-neutral-600">{address.phone}</p>
            <p className="text-neutral-600">
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}, {address.city}
              {address.area ? `, ${address.area}` : ""}
              {address.postCode ? ` ${address.postCode}` : ""}
            </p>
          </div>
          <form action={deleteAddress}>
            <input type="hidden" name="id" value={address.id} />
            <button
              type="submit"
              className="text-neutral-400 hover:text-red-600"
              aria-label="Delete address"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </form>
        </div>
      ))}

      {adding ? (
        <form
          action={async (formData) => {
            await createAddress(formData);
            setAdding(false);
          }}
          className="space-y-3 rounded-xl border border-neutral-200 p-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="recipientName">Recipient name</Label>
              <Input id="recipientName" name="recipientName" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="line1">Address line 1</Label>
            <Input id="line1" name="line1" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="line2">Address line 2</Label>
            <Input id="line2" name="line2" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="area">Area</Label>
              <Input id="area" name="area" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postCode">Post code</Label>
              <Input id="postCode" name="postCode" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input type="checkbox" name="isDefault" className="h-4 w-4 rounded border-neutral-300" />
            Set as default address
          </label>
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              Save address
            </Button>
            {addresses.length > 0 && (
              <Button type="button" size="sm" variant="outline" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      ) : (
        <Button type="button" size="sm" variant="outline" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" /> Add address
        </Button>
      )}
    </div>
  );
}
