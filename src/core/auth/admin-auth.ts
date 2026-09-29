import { getServerSession } from "next-auth";
import { prisma } from "@/core/db/prisma";
import { authOptions } from "@/core/auth/auth";

export class AdminAuthError extends Error {
  status: number;

  constructor(message = "Unauthorized", status = 401) {
    super(message);
    this.name = "AdminAuthError";
    this.status = status;
  }
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  const adminId = session?.user?.id;
  const email = session?.user?.email;
  if (!adminId && !email) {
    throw new AdminAuthError("Unauthorized", 401);
  }

  const admin = adminId
    ? await prisma.adminUser.findUnique({ where: { id: adminId } })
    : await prisma.adminUser.findUnique({ where: { email: email! } });
  if (!admin) {
    throw new AdminAuthError("Unauthorized", 401);
  }

  const issuedAt = Number(session.authIssuedAt ?? 0);
  if (admin.passwordChangedAt && issuedAt && issuedAt * 1000 < admin.passwordChangedAt.getTime()) {
    throw new AdminAuthError("Session expired. Please sign in again.", 401);
  }

  return { session, admin };
}
