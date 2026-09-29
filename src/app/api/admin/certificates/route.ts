import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { certificateInputSchema, certificateReorderSchema } from "@/lib/certificates";
import { z } from "zod";

export async function GET() {
  try {
    await requireAdmin();
    const certificates = await prisma.certificate.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ certificates });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = certificateInputSchema.parse(body);
    const certificate = await prisma.certificate.create({ data: validated });
    return NextResponse.json({ certificate }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const { ids } = certificateReorderSchema.parse(await request.json());
    await prisma.$transaction(
      ids.map((id, displayOrder) => prisma.certificate.update({ where: { id }, data: { displayOrder } })),
    );
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
