"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, Plus, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addProductImage } from "@/lib/actions/product-images";
import type { ProductMediaType } from "@prisma/client";

/**
 * "Add media" control for the product gallery: a URL paste + Add button
 * (form action) for the single-URL path — auto-detects a YouTube/Vimeo link
 * and stores it as an embedded video — plus a multi-select file picker,
 * a drag-and-drop zone, and clipboard-paste support (e.g. copy a file in
 * Windows Explorer, paste it here) — all three upload every chosen
 * image/video file and append each straight to the gallery via the
 * addProductImage server action.
 */
export function ImageUrlUploader({ productId }: { productId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(files: File[]) {
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

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    void uploadFiles(Array.from(e.target.files ?? []));
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    void uploadFiles(Array.from(e.dataTransfer.files ?? []));
  }

  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData?.files ?? []);
    if (files.length === 0) return; // plain text paste — let it through normally
    e.preventDefault();
    void uploadFiles(files);
  }

  return (
    <div
      className={cn(
        "space-y-1.5 rounded-lg border-2 border-dashed p-2 transition-colors",
        dragActive ? "border-neutral-900 bg-neutral-50" : "border-transparent"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={onDrop}
    >
      <div className="flex flex-wrap gap-2">
        <Input
          ref={inputRef}
          name="imageUrl"
          placeholder="Paste a URL, an image file, or drop files here →"
          className="min-w-[12rem] flex-1"
          onPaste={onPaste}
          required
        />
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
      <p className="flex items-center gap-1.5 text-xs text-neutral-500">
        <ImagePlus className="h-3.5 w-3.5 shrink-0" />
        Drag and drop files anywhere in this box, paste a copied file (e.g. from Windows Explorer)
        into the field above, select multiple at once with Upload, or paste a YouTube/Vimeo link —
        the first item in the gallery is used as the primary/homepage image.
      </p>
    </div>
  );
}
