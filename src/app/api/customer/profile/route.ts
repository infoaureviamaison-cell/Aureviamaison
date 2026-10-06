import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { customerFromCookie, hashCustomerToken, newCustomerToken, setCustomerCookie } from "@/lib/customer-auth";
import { customerSummary, logCustomerActivity, publicCustomerInclude } from "@/lib/customer-data";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(7).max(30),
  address: z.object({ line1: z.string().trim().min(2), line2: z.string().trim().optional(), city: z.string().trim().min(2), state: z.string().trim().optional(), pincode: z.string().trim().optional(), country: z.string().trim().default("PK") }),
  dateOfBirth: z.string().optional().nullable(),
});

export async function GET() {
  const current = await customerFromCookie();
  if (!current) return NextResponse.json({ customer: null });
  const customer = await prisma.customer.findUnique({ where: { id: current.id }, include: publicCustomerInclude });
  return NextResponse.json({ customer: customer ? customerSummary(customer) : null });
}

async function save(request: Request) {
  try {
    const input = profileSchema.parse(await request.json());
    const current = await customerFromCookie();
    const data = { name: input.name, email: input.email.toLowerCase(), phone: input.phone, address: input.address, dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null, lastActiveAt: new Date() };
    let token: string | null = null;
    const customer = current
      ? await prisma.customer.update({ where: { id: current.id }, data, include: publicCustomerInclude })
      : await (async () => { token = newCustomerToken(); return prisma.customer.create({ data: { ...data, accessTokenHash: hashCustomerToken(token) }, include: publicCustomerInclude }); })();
    await logCustomerActivity(customer.id, current ? "profile_updated" : "profile_created", current ? "Customer updated profile information" : "Customer profile created");
    const response = NextResponse.json({ customer: customerSummary(customer) }, { status: current ? 200 : 201 });
    return token ? setCustomerCookie(response, token) : response;
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid profile" }, { status: 400 });
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export const POST = save;
export const PUT = save;
