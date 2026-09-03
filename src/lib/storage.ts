/**
 * Server-only product-image uploads to local disk, under public/uploads/products.
 * Next.js serves the public/ directory as-is (dev and `next start` alike), so a
 * file written here is immediately reachable at the returned URL — no separate
 * static-file route needed.
 *
 * Production note (Hostinger): this directory must survive redeploys — make
 * sure whatever deploy process is used does not wipe/replace public/uploads.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
const IMAGE_MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
const VIDEO_MAX_BYTES = 100 * 1024 * 1024; // 100 MB

async function saveFile(file: File, dir: string, publicPath: string, ext: string) {
  const filename = `${crypto.randomUUID()}.${ext}`;
  const fullDir = path.join(UPLOAD_ROOT, dir);
  await mkdir(fullDir, { recursive: true });
  await writeFile(path.join(fullDir, filename), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${publicPath}/${filename}` };
}

export async function uploadProductImage(file: File): Promise<{ url: string }> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("Unsupported image type. Use JPG, PNG, WebP, AVIF, or GIF.");
  if (file.size > IMAGE_MAX_BYTES) throw new Error("Image is too large (max 8 MB).");
  return saveFile(file, "products", "products", ext);
}

export async function uploadProductVideo(file: File): Promise<{ url: string }> {
  const ext = VIDEO_TYPES[file.type];
  if (!ext) throw new Error("Unsupported video type. Use MP4, WebM, or MOV.");
  if (file.size > VIDEO_MAX_BYTES) throw new Error("Video is too large (max 100 MB).");
  return saveFile(file, "videos", "videos", ext);
}

export function isVideoFile(mimeType: string): boolean {
  return mimeType in VIDEO_TYPES;
}
