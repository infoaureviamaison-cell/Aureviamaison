import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const CUSTOMER_COOKIE = "aurevia_customer";

export function hashCustomerToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function newCustomerToken() {
  return randomBytes(32).toString("base64url");
}

export async function customerFromCookie() {
  const token = (await cookies()).get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  return prisma.customer.findUnique({ where: { accessTokenHash: hashCustomerToken(token) } });
}

export function setCustomerCookie(response: Response, token: string) {
  const headers = response.headers;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  headers.append("Set-Cookie", `${CUSTOMER_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${secure}`);
  return response;
}
