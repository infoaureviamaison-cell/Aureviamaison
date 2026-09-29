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

function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function validPassword(password: string) {
  return password.length >= 10 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
}

function errorResponse(error: unknown) {
  const status = error instanceof AdminAuthError ? error.status : 500;
  return NextResponse.json({ error: error instanceof Error ? error.message : "Admin account request failed" }, { status });
}

export async function GET() {
  try {
    await requireAdmin();
    const primaryEmail = getAdminSecurityEmail();
    const admins = await prisma.adminUser.findMany({
      select: { id: true, email: true, name: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ admins: admins.map((admin) => ({ ...admin, isPrimary: admin.email.toLowerCase() === primaryEmail })) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { admin } = await requireAdmin();
    const body = await request.json();

    if (body.action === "request-create" || body.action === "request-email-change") {
      const requestAction = body.action === "request-create" ? "CREATE" : "CHANGE_EMAIL";
      const newEmail = normalizeEmail(body.newEmail);
      const password = String(body.password ?? "");
      if (!/^\S+@\S+\.\S+$/.test(newEmail)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
      if (await prisma.adminUser.findUnique({ where: { email: newEmail } })) return NextResponse.json({ error: "That admin email already exists." }, { status: 409 });

      let targetAdminId: string | null = null;
      let passwordHash: string | null = null;
      if (requestAction === "CREATE") {
        if (!validPassword(password)) return NextResponse.json({ error: "Use a 10+ character password with uppercase, lowercase, and a number." }, { status: 400 });
        passwordHash = await bcrypt.hash(password, 12);
      } else {
        targetAdminId = String(body.targetAdminId ?? "");
        const target = await prisma.adminUser.findUnique({ where: { id: targetAdminId } });
        if (!target) return NextResponse.json({ error: "Admin account not found." }, { status: 404 });
        if (target.email.toLowerCase() === getAdminSecurityEmail()) return NextResponse.json({ error: "The primary security email cannot be changed." }, { status: 400 });
      }

      const recentCount = await prisma.adminAccountRequest.count({ where: { requestedById: admin.id, createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } } });
      if (recentCount >= 3) return NextResponse.json({ error: "Too many codes requested. Try again in 15 minutes." }, { status: 429 });

      const requestId = randomUUID();
      const otp = randomInt(100000, 1000000).toString();
      await prisma.adminAccountRequest.create({ data: {
        id: requestId,
        requestedById: admin.id,
        action: requestAction,
        targetAdminId,
        newEmail,
        passwordHash,
        otpHash: hashOtp(requestId, otp),
        expiresAt: new Date(Date.now() + OTP_LIFETIME_MS),
      } });
      try {
        await sendSecurityOtp(otp, requestAction === "CREATE" ? "new admin creation" : "admin email change");
      } catch (error) {
        await prisma.adminAccountRequest.delete({ where: { id: requestId } }).catch(() => null);
        throw error;
      }
      return NextResponse.json({ requestId, emailHint: getAdminSecurityEmail().replace(/(^.).*(@.*$)/, "$1***$2") });
    }

    if (body.action === "verify") {
      const requestId = String(body.requestId ?? "");
      const otp = String(body.otp ?? "").replace(/\D/g, "");
      const pending = await prisma.adminAccountRequest.findFirst({ where: { id: requestId, requestedById: admin.id } });
      if (!pending || pending.expiresAt <= new Date()) {
        if (pending) await prisma.adminAccountRequest.delete({ where: { id: pending.id } });
        return NextResponse.json({ error: "Code expired. Please start again." }, { status: 400 });
      }
      if (pending.attempts >= MAX_ATTEMPTS) {
        await prisma.adminAccountRequest.delete({ where: { id: pending.id } });
        return NextResponse.json({ error: "Too many incorrect attempts. Please start again." }, { status: 429 });
      }
      if (otp.length !== 6 || hashOtp(requestId, otp) !== pending.otpHash) {
        await prisma.adminAccountRequest.update({ where: { id: pending.id }, data: { attempts: { increment: 1 } } });
        return NextResponse.json({ error: "Incorrect verification code." }, { status: 400 });
      }

      if (pending.action === "CREATE" && pending.passwordHash) {
        await prisma.adminUser.create({ data: { email: pending.newEmail, password: pending.passwordHash } });
      } else if (pending.action === "CHANGE_EMAIL" && pending.targetAdminId) {
        await prisma.adminUser.update({ where: { id: pending.targetAdminId }, data: { email: pending.newEmail } });
      } else {
        return NextResponse.json({ error: "Invalid pending request." }, { status: 400 });
      }
      await prisma.adminAccountRequest.deleteMany({ where: { requestedById: admin.id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    return errorResponse(error);
  }
}
