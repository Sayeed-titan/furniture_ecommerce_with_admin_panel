/**
 * Server-only product-image uploads to Supabase Storage via its REST API
 * (no SDK, no extra dependency). Configured via env:
 *
 *   NEXT_PUBLIC_SUPABASE_URL      https://<ref>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY     service role key (server-only secret)
 *   SUPABASE_STORAGE_BUCKET       bucket name (defaults to "product-images")
 *
 * The bucket must exist and be public. When unconfigured, isStorageConfigured()
 * is false and the admin UI falls back to pasting an image URL.
 */

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "product-images";

export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

function extensionFor(contentType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
  };
  return map[contentType] ?? "bin";
}

export async function uploadProductImage(file: File): Promise<{ url: string }> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error("Supabase Storage is not configured");

  if (!ALLOWED.has(file.type)) {
    throw new Error("Unsupported image type. Use JPG, PNG, WebP, AVIF, or GIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image is too large (max 8 MB).");
  }

  const ext = extensionFor(file.type);
  const path = `${crypto.randomUUID()}.${ext}`;
  const uploadUrl = `${base}/storage/v1/object/${BUCKET}/${path}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": file.type,
      "x-upsert": "true",
      "cache-control": "max-age=31536000",
    },
    body: await file.arrayBuffer(),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status}): ${detail.slice(0, 200)}`);
  }

  return { url: `${base}/storage/v1/object/public/${BUCKET}/${path}` };
}
