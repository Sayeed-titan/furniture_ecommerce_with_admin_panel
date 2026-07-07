import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isStorageConfigured, uploadProductImage } from "@/lib/storage";

export async function POST(request: Request) {
  // Admin-only: the middleware already guards /admin, but API routes need
  // their own check.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Image storage is not configured. Paste an image URL instead." },
      { status: 501 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const { url } = await uploadProductImage(file);
    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
