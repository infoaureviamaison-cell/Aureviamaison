import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AdminAuthError, requireAdmin } from "@/lib/admin-auth";
import { listAllImages, uploadImage } from "@/lib/cloudinary";

export async function GET() {
  try {
    await requireAdmin();
    const cloudImages = await listAllImages();
    await Promise.all(cloudImages.map((image) => prisma.mediaAsset.upsert({
      where: { publicId: image.publicId },
      update: { url: image.url, size: image.bytes, type: `image/${image.format}` },
      create: {
        filename: image.filename,
        url: image.url,
        publicId: image.publicId,
        type: `image/${image.format}`,
        size: image.bytes,
        usedIn: "cloudinary",
        createdAt: new Date(image.createdAt),
      },
    })));
    const cloudIds = cloudImages.map((image) => image.publicId);
    const media = cloudIds.length
      ? await prisma.mediaAsset.findMany({ where: { publicId: { in: cloudIds } }, orderBy: { createdAt: "desc" } })
      : [];
    return NextResponse.json({ media });
  } catch (error: unknown) {
    const status = error instanceof AdminAuthError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load Cloudinary media" }, { status });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file");
    const usedIn = String(formData.get("usedIn") || "media");
    const alt = String(formData.get("alt") || "");
    const folder = String(formData.get("folder") || "auerviamaison/media");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploaded = await uploadImage(buffer, folder);

    const media = await prisma.mediaAsset.create({
      data: {
        filename: file.name,
        url: uploaded.url,
        publicId: uploaded.publicId,
        type: file.type || "image",
        size: uploaded.bytes,
        alt: alt || null,
        usedIn,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error: unknown) {
    const status = error instanceof AdminAuthError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status });
  }
}
