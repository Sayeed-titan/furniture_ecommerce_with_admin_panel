import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRolePermissions, hasPermission } from "@/lib/authz";
import { uploadHeroImage } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as { userType?: string; roleId?: string } | undefined;
  if (!session?.user || user?.userType !== "admin" || !user.roleId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const permissions = await getRolePermissions(user.roleId);
  if (!hasPermission(permissions, "settings.edit")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const { url } = await uploadHeroImage(file);
    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
