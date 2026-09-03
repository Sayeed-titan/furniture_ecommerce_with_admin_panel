import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadProductImage, uploadProductVideo, isVideoFile } from "@/lib/storage";

export async function POST(request: Request) {
  // Admin-only: the middleware already guards /admin, but API routes need
  // their own check.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const isVideo = isVideoFile(file.type);
    const { url } = isVideo ? await uploadProductVideo(file) : await uploadProductImage(file);
    return NextResponse.json({ url, type: isVideo ? "VIDEO_FILE" : "IMAGE" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
