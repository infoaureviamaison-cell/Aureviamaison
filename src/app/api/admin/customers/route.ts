import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { hashCustomerToken, newCustomerToken } from "@/lib/customer-auth";

const schema = z.object({ name: z.string().min(2), email: z.string().email().optional().or(z.literal("")), phone: z.string().optional(), address: z.any().optional(), notes: z.string().optional() });

export async function GET(request: Request) {
  try { await requireAdmin(); const url = new URL(request.url); const search = url.searchParams.get("search")?.trim(); const status = url.searchParams.get("status");
    const customers = await prisma.customer.findMany({ where: { AND: [search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }, { phone: { contains: search, mode: "insensitive" } }] } : {}, status ? { orders: { some: { orderStatus: status } } } : {}] }, include: { orders: { select: { id: true, total: true, orderStatus: true, createdAt: true } }, _count: { select: { wishlistItems: true, activities: true } } }, orderBy: { lastActiveAt: "desc" }, take: 200 });
    return NextResponse.json({ customers: customers.map((customer) => ({ ...customer, accessTokenHash: undefined, stats: { totalOrders: customer.orders.length, completed: customer.orders.filter((o) => o.orderStatus === "completed").length, pending: customer.orders.filter((o) => !["completed","cancelled"].includes(o.orderStatus)).length, cancelled: customer.orders.filter((o) => o.orderStatus === "cancelled").length, spent: customer.orders.filter((o) => o.orderStatus === "completed").reduce((sum,o) => sum + o.total, 0), lastOrder: customer.orders.sort((a,b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0]?.createdAt || null } })) });
  } catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 401 }); }
}

export async function POST(request: Request) {
  try { await requireAdmin(); const input = schema.parse(await request.json()); const customer = await prisma.customer.create({ data: { ...input, email: input.email?.toLowerCase() || null, accessTokenHash: hashCustomerToken(newCustomerToken()), activities: { create: { type: "admin_created", description: "Customer record created by administrator" } } } }); return NextResponse.json({ customer }, { status: 201 }); }
  catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }); }
}
