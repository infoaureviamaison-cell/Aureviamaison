import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { customerFromCookie } from "@/lib/customer-auth";
import { logCustomerActivity } from "@/lib/customer-data";

const schema = z.object({ productId: z.string().min(1) });

export async function GET() {
  const customer = await customerFromCookie();
  if (!customer) return NextResponse.json({ wishlist: [] });
  const wishlist = await prisma.wishlistItem.findMany({ where: { customerId: customer.id }, include: { product: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ wishlist });
}

export async function POST(request: Request) {
  const customer = await customerFromCookie();
  if (!customer) return NextResponse.json({ error: "Complete your profile to sync this wishlist" }, { status: 401 });
  try {
    const { productId } = schema.parse(await request.json());
    const item = await prisma.wishlistItem.upsert({ where: { customerId_productId: { customerId: customer.id, productId } }, create: { customerId: customer.id, productId }, update: {}, include: { product: true } });
    await logCustomerActivity(customer.id, "wishlist_added", `Added ${item.product.title} to wishlist`, { productId });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }); }
}

export async function DELETE(request: Request) {
  const customer = await customerFromCookie();
  if (!customer) return NextResponse.json({ ok: true });
  const { productId } = schema.parse(await request.json());
  await prisma.wishlistItem.deleteMany({ where: { customerId: customer.id, productId } });
  await logCustomerActivity(customer.id, "wishlist_removed", "Removed a product from wishlist", { productId });
  return NextResponse.json({ ok: true });
}
