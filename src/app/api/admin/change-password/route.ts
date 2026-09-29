import { createHash, randomInt, randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { AdminAuthError, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getAdminSecurityEmail, sendSecurityOtp } from "@/lib/security-email";

const OTP_LIFETIME_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function hashOtp(requestId: string, otp: string) {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  if (!secret) throw new Error("Authentication secret is not configured");
  return createHash("sha256").update(`${requestId}:${otp}:${secret}`).digest("hex");
}

function validPassword(password: string) {
  return password.length >= 10 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
}

export async function POST(request: Request) {
  try {
    const { admin } = await requireAdmin();
    const body = await request.json();

    if (body.action === "request") {
      const currentPassword = String(body.currentPassword ?? "");
      const newPassword = String(body.newPassword ?? "");
      if (!validPassword(newPassword)) {
        return NextResponse.json({ error: "Use at least 10 characters with uppercase, lowercase, and a number." }, { status: 400 });
      }
      if (!(await bcrypt.compare(currentPassword, admin.password))) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }
      if (await bcrypt.compare(newPassword, admin.password)) {
        return NextResponse.json({ error: "The new password must be different." }, { status: 400 });
      }

      const recentCount = await prisma.passwordChangeRequest.count({
        where: { adminId: admin.id, createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } },
      });
      if (recentCount >= 3) {
        return NextResponse.json({ error: "Too many codes requested. Try again in 15 minutes." }, { status: 429 });
      }

      const requestId = randomUUID();
      const otp = randomInt(100000, 1000000).toString();
      await prisma.$transaction([
        prisma.passwordChangeRequest.deleteMany({ where: { adminId: admin.id, expiresAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
        prisma.passwordChangeRequest.create({ data: {
          id: requestId,
          adminId: admin.id,
          otpHash: hashOtp(requestId, otp),
          passwordHash: await bcrypt.hash(newPassword, 12),
          expiresAt: new Date(Date.now() + OTP_LIFETIME_MS),
        } }),
      ]);
      try {
        await sendSecurityOtp(otp, "password change");
      } catch (error) {
        await prisma.passwordChangeRequest.delete({ where: { id: requestId } }).catch(() => null);
        throw error;
      }
      const securityEmail = getAdminSecurityEmail();
      return NextResponse.json({ success: true, requestId, emailHint: securityEmail.replace(/(^.).*(@.*$)/, "$1***$2") });
    }

    if (body.action === "verify") {
      const requestId = String(body.requestId ?? "");
      const otp = String(body.otp ?? "").replace(/\D/g, "");
      const pending = await prisma.passwordChangeRequest.findFirst({ where: { id: requestId, adminId: admin.id } });
      if (!pending || pending.expiresAt <= new Date()) {
        if (pending) await prisma.passwordChangeRequest.delete({ where: { id: pending.id } });
        return NextResponse.json({ error: "Code expired. Please start again." }, { status: 400 });
      }
      if (pending.attempts >= MAX_ATTEMPTS) {
        await prisma.passwordChangeRequest.delete({ where: { id: pending.id } });
        return NextResponse.json({ error: "Too many incorrect attempts. Please start again." }, { status: 429 });
      }
      const latest = await prisma.passwordChangeRequest.findFirst({ where: { adminId: admin.id }, orderBy: { createdAt: "desc" }, select: { id: true } });
      if (latest?.id !== pending.id) {
        return NextResponse.json({ error: "A newer code was requested. Use the latest email." }, { status: 400 });
      }
      if (otp.length !== 6 || hashOtp(requestId, otp) !== pending.otpHash) {
        await prisma.passwordChangeRequest.update({ where: { id: pending.id }, data: { attempts: { increment: 1 } } });
        return NextResponse.json({ error: "Incorrect verification code." }, { status: 400 });
      }

      await prisma.$transaction([
        prisma.adminUser.update({ where: { id: admin.id }, data: { password: pending.passwordHash, passwordChangedAt: new Date() } }),
        prisma.passwordChangeRequest.deleteMany({ where: { adminId: admin.id } }),
      ]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    const status = error instanceof AdminAuthError ? error.status : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to change password" }, { status });
  }
}
