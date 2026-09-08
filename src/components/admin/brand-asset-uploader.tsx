"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Loader2, X } from "lucide-react";
import { saveBrandAsset } from "@/lib/actions/branding";

export function BrandAssetUploader({
  kind,
  label,
  description,
  currentUrl,
}: {
  kind: "icon" | "logo";
  label: string;
  description: string;
  currentUrl: string | null;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("kind", kind);
      const res = await fetch("/api/admin/upload-brand", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Upload failed");

      await saveBrandAsset(kind, json.url);
      toast.success(`${label} updated.`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onRemove() {
    try {
      await saveBrandAsset(kind, "");
      toast.success(`${label} removed.`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove it.");
    }
  }

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-neutral-900">{label}</p>
      <p className="text-xs text-neutral-500">{description}</p>
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-white">
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded asset
            <img src={currentUrl} alt={label} className="h-full w-full object-contain" />
          ) : (
            <span className="text-[10px] text-neutral-400">None</span>
          )}
        </span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {currentUrl ? "Replace" : "Upload"}
        </button>
        {currentUrl && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <X className="h-3.5 w-3.5" /> Remove
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={onFile}
        />
      </div>
    </div>
  );
}
