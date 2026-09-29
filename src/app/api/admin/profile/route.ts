import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  try {
    const { admin } = await requireAdmin();
    return NextResponse.json({ admin: { id: admin.id, email: admin.email, name: admin.name, createdAt: admin.createdAt } });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const { admin } = await requireAdmin();
    const body = await request.json();
    const adminUser = await prisma.adminUser.update({
      where: { id: admin.id },
      data: { name: body.name },
    });
    return NextResponse.json(adminUser);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
