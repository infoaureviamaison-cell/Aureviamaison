import nodemailer from "nodemailer";

export function getAdminSecurityEmail() {
  return (process.env.ADMIN_SECURITY_EMAIL || "care@auerviamaison.com").trim().toLowerCase();
}

export async function sendSecurityOtp(otp: string, purpose: string) {
  const user = process.env.GMAIL_USER || process.env.ADMIN_EMAIL || process.env.ADMIN_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD || process.env.googleapppassword;
  if (!user || !user.includes("@") || !appPassword) {
    throw new Error("Security email is not configured. Add GMAIL_USER and GMAIL_APP_PASSWORD.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: appPassword.replaceAll(" ", "") },
  });
  await transporter.sendMail({
    from: `Auerviamaison Security <${user}>`,
    to: getAdminSecurityEmail(),
    subject: `Auerviamaison security code: ${purpose}`,
    text: `Your verification code for ${purpose} is ${otp}. It expires in 10 minutes. If you did not request this, do not share the code.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h2>Confirm ${purpose}</h2><p>Enter this code in the Auerviamaison admin:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:18px;background:#f7f3e8;text-align:center">${otp}</div><p>This code expires in 10 minutes. If you did not request this, do not share the code.</p></div>`,
  });
}
