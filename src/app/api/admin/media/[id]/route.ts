import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AdminAuthError, requireAdmin } from "@/lib/admin-auth";
import { deleteImage } from "@/lib/cloudinary";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const media = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!media) return NextResponse.json({ error: "Media not found" }, { status: 404 });
    const deleted = await deleteImage(media.publicId);
    if (!deleted) {
      return NextResponse.json({ error: "Cloudinary did not confirm deletion" }, { status: 502 });
    }
    await prisma.mediaAsset.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const status = error instanceof AdminAuthError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Deletion failed" }, { status });
  }
}
