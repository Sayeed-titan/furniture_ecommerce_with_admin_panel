"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Loader2, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { addHeroSlide, removeHeroSlide, moveHeroSlide } from "@/lib/actions/hero";

const MAX_SLIDES = 5;

export function HeroSlideManager({ slides }: { slides: string[] }) {
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
      const res = await fetch("/api/admin/upload-hero", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Upload failed");

      const result = await addHeroSlide(json.url);
      if (result.error) throw new Error(result.error);
      toast.success("Hero photo added.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleRemove(formData: FormData) {
    try {
      await removeHeroSlide(formData);
      toast.success("Hero photo removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove the photo.");
    }
  }

  async function handleMove(formData: FormData) {
    try {
      await moveHeroSlide(formData);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't reorder.");
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500">
        {slides.length} of {MAX_SLIDES} photos. When more than one is set, the hero background
        rotates through them automatically. With none set, a default photo is shown.
      </p>

      {slides.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {slides.map((url, i) => (
            <li key={url} className="group relative overflow-hidden rounded-lg border border-neutral-200">
              <div className="relative aspect-video bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded asset */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-neutral-900/80 px-2 py-0.5 text-[10px] font-medium text-white">
                  {i + 1}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 border-t border-neutral-200 bg-white px-2 py-1.5">
                <div className="flex gap-1">
                  <form action={handleMove}>
                    <input type="hidden" name="url" value={url} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={i === 0}
                      aria-label="Move earlier"
                      className="rounded p-1 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                  </form>
                  <form action={handleMove}>
                    <input type="hidden" name="url" value={url} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={i === slides.length - 1}
                      aria-label="Move later"
                      className="rounded p-1 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
                <form action={handleRemove}>
                  <input type="hidden" name="url" value={url} />
                  <button type="submit" aria-label="Remove photo" className="rounded p-1 text-red-500 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {slides.length < MAX_SLIDES && (
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Add hero photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        </div>
      )}
    </div>
  );
}
