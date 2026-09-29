import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  legalPageDefaults,
  legalPagePaths,
  legalPageSlugs,
  type LegalPageSlug,
} from "@/components/legal/legal-page-content";

const sectionSchema = z.object({
  id: z.string().trim().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().min(1).max(30000),
});

const pageSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(320),
  lastUpdated: z.string().trim().min(1).max(80),
  sections: z.array(sectionSchema).min(1).max(30),
});

const payloadSchema = z.object(
  Object.fromEntries(legalPageSlugs.map((slug) => [slug, pageSchema])) as Record<
    LegalPageSlug,
    typeof pageSchema
  >,
);

export async function GET() {
  try {
    await requireAdmin();
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: legalPageSlugs.map((slug) => `legalPage:${slug}`) } },
      select: { key: true, value: true },
    });
    const saved = new Map(settings.map((setting) => [setting.key.replace("legalPage:", ""), setting.value]));
    const pages = Object.fromEntries(
      legalPageSlugs.map((slug) => [slug, saved.get(slug) ?? legalPageDefaults[slug]]),
    );
    return NextResponse.json({ pages });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const pages = payloadSchema.parse(await request.json());

    await prisma.$transaction(
      legalPageSlugs.map((slug) =>
        prisma.siteSetting.upsert({
          where: { key: `legalPage:${slug}` },
          update: { value: pages[slug] as unknown as Prisma.InputJsonValue },
          create: { key: `legalPage:${slug}`, value: pages[slug] as unknown as Prisma.InputJsonValue },
        }),
      ),
    );

    for (const slug of legalPageSlugs) revalidatePath(legalPagePaths[slug]);
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid legal page content", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save legal pages" }, { status: 500 });
  }
}
