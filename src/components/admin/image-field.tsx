"use client";

import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Product image field: a URL input that always works, plus an optional
 * "upload" button that pushes a file to Supabase Storage via
 * /api/admin/upload and fills the URL on success. If storage isn't
 * configured the upload endpoint returns 501 and we surface a hint —
 * the URL input remains the fallback either way.
 */
export function ImageField({ defaultValue }: { defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setUrl(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor="imageUrl">Product image</Label>
      <div className="flex gap-2">
        <Input
          id="imageUrl"
          name="imageUrl"
          placeholder="https://... or upload a file"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-neutral-300 px-3 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-xs text-neutral-500">
        Paste an image URL, or upload a file (JPG, PNG, WebP · max 8 MB).
      </p>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary URL; next/image adds no value here
        <img
          src={url}
          alt="Preview"
          className="mt-2 h-32 w-32 rounded-md border border-neutral-200 object-cover"
        />
      )}
    </div>
  );
}
