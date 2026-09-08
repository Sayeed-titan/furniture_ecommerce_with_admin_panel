import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/authz";
import { isValidBackupFilename, readBackupFile } from "@/lib/backup";

type Params = Promise<{ filename: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  await requirePermission("backup.view");

  const { filename } = await params;
  if (!isValidBackupFilename(filename)) {
    return NextResponse.json({ error: "Invalid backup filename" }, { status: 400 });
  }

  try {
    const buffer = await readBackupFile(filename);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Backup not found" }, { status: 404 });
  }
}
