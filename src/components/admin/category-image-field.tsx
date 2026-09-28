"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Loader2, X } from "lucide-react";

/** Upload control for a category's homepage placeholder image — sets a
 *  hidden input's value on upload so it rides along with the rest of the
 *  row's edit form (name/shortCode/showOnHome), saved together on that
 *  form's own Save button rather than persisting immediately. */
export function CategoryImageField({ name, defaultValue }: { name: string; defaultValue: string | null }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/upload-category", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setUrl(json.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input type="hidden" name={name} value={url} readOnly />
      <span className="flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-white">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded asset
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-[9px] text-neutral-400">None</span>
        )}
      </span>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium hover:bg-neutral-100 disabled:opacity-50"
      >
        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        {url ? "Replace" : "Upload"}
      </button>
      {url && (
        <button
          type="button"
          onClick={() => setUrl("")}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          <X className="h-3 w-3" /> Remove
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={onFile} />
    </div>
  );
}
