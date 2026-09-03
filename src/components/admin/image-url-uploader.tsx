"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addProductImage } from "@/lib/actions/product-images";
import type { ProductMediaType } from "@prisma/client";

/**
 * "Add media" control for the product gallery: a URL paste + Add button
 * (form action) for the single-URL path — auto-detects a YouTube/Vimeo link
 * and stores it as an embedded video — plus a multi-select file picker that
 * uploads every chosen image/video file and appends each straight to the
 * gallery via the addProductImage server action.
 */
export function ImageUrlUploader({ productId }: { productId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    const failures: string[] = [];

    for (const file of files) {
      try {
        const data = new FormData();
        data.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: data });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error ?? "Upload failed");

        const addData = new FormData();
        addData.append("imageUrl", json.url);
        await addProductImage(productId, addData, json.type as ProductMediaType);
      } catch (err) {
        failures.push(`${file.name}: ${err instanceof Error ? err.message : "Upload failed"}`);
      }
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (failures.length > 0) setError(failures.join(" · "));
    router.refresh();
  }

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-2">
        <Input ref={inputRef} name="imageUrl" placeholder="Paste image/YouTube/Vimeo URL or upload →" className="min-w-[12rem] flex-1" required />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-neutral-300 px-3 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
        </button>
        <Button type="submit" className="shrink-0">
          <Plus className="h-4 w-4" /> Add
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime"
          multiple
          className="hidden"
          onChange={onFiles}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-xs text-neutral-500">
        Select multiple images/videos at once to add them all, or paste a YouTube/Vimeo link — the
        first item in the gallery is used as the primary/homepage image.
      </p>
    </div>
  );
}
