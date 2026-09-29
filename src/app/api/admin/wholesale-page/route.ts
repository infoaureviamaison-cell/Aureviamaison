import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { defaultWholesalePage, parseWholesalePage, WHOLESALE_PAGE_KEY, wholesalePageSchema } from "@/lib/wholesale-page";

export async function GET() {
  try {
    await requireAdmin();
    const setting = await prisma.siteSetting.findUnique({ where: { key: WHOLESALE_PAGE_KEY } });
    return NextResponse.json({ content: setting ? parseWholesalePage(setting.value) : defaultWholesalePage });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const content = wholesalePageSchema.parse(await request.json());
    await prisma.siteSetting.upsert({
      where: { key: WHOLESALE_PAGE_KEY },
      update: { value: content },
      create: { key: WHOLESALE_PAGE_KEY, value: content },
    });
    return NextResponse.json({ content });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save wholesale page" }, { status: 500 });
  }
}
