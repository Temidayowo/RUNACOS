import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // For non-public uploads, require authentication
    const isPublicUpload = folder === "frms" || folder === "passports";
    if (!isPublicUpload) {
      const session = await auth();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const result = await uploadFile(file, folder);

    if (result.error) {
      console.error("Upload error detail:", result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: { url: result.url } });
  } catch (error: any) {
    console.error("Upload error:", error?.message, error?.Code, error?.stack);
    return NextResponse.json({ error: error?.message || "Upload failed" }, { status: 500 });
  }
}
