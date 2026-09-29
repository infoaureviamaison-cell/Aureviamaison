"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiSave } from "react-icons/fi";

export function Message({ message }: { message: string }) {
  if (!message) return null;
  const isError = message.includes("Failed") || message.includes("don't");
  return <div className={`mb-4 rounded-lg p-3 text-sm ${isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>{message}</div>;
}

export function AccountPanel({ name, setName, email, saving, onSave }: {
  name: string; setName: (value: string) => void; email: string; saving: boolean; onSave: () => Promise<void>;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">Account Information</h2>
      <div className="space-y-4">
        <Input label="Name" value={name} onChange={setName} />
        <Input label="Email" type="email" value={email} disabled />
        <button onClick={onSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#C6A24A] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8923f] disabled:opacity-50"><FiSave className="h-4 w-4" />{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </div>
  );
}

export function PasswordPanel(props: {
  currentPassword: string; setCurrentPassword: (value: string) => void;
  newPassword: string; setNewPassword: (value: string) => void;
  confirmPassword: string; setConfirmPassword: (value: string) => void;
  otp: string; setOtp: (value: string) => void; requestId: string; emailHint: string;
  saving: boolean; onRequest: () => Promise<void>; onVerify: () => Promise<void>; onRestart: () => void;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="flex items-center gap-2 text-lg font-semibold"><FiLock className="h-5 w-5" />Security · Change Password</h2>
      <div className="mb-5 mt-3 flex items-center gap-2 text-xs font-semibold"><span className={`rounded-full px-3 py-1 ${!props.requestId ? "bg-[#C6A24A] text-white" : "bg-green-100 text-green-700"}`}>1. New password</span><span className={`rounded-full px-3 py-1 ${props.requestId ? "bg-[#C6A24A] text-white" : "bg-gray-100 text-gray-500"}`}>2. Email code</span></div>
      {!props.requestId ? <div className="space-y-4">
          <Input label="Current Password" type="password" value={props.currentPassword} onChange={props.setCurrentPassword} />
          <Input label="New Password" type="password" value={props.newPassword} onChange={props.setNewPassword} />
          <Input label="Confirm New Password" type="password" value={props.confirmPassword} onChange={props.setConfirmPassword} />
          <p className="text-xs text-gray-500">Use at least 10 characters with uppercase, lowercase, and a number.</p>
          <button onClick={props.onRequest} disabled={props.saving || !props.currentPassword || !props.newPassword || !props.confirmPassword} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"><FiLock className="h-4 w-4" />{props.saving ? "Sending code..." : "Continue & send code"}</button>
        </div> : <div className="space-y-4">
          <p className="text-sm text-gray-600">A 6-digit code was sent to <strong>{props.emailHint}</strong>. It expires in 10 minutes.</p>
          <Input label="Verification Code" value={props.otp} onChange={(value) => props.setOtp(value.replace(/\D/g, "").slice(0, 6))} />
          <div className="flex gap-2"><button onClick={props.onVerify} disabled={props.saving || props.otp.length !== 6} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"><FiLock className="h-4 w-4" />{props.saving ? "Verifying..." : "Verify & change password"}</button><button onClick={props.onRestart} disabled={props.saving} className="rounded-lg border px-4 py-2 text-sm">Start again</button></div>
        </div>}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", disabled }: { label: string; value: string; onChange?: (value: string) => void; type?: string; disabled?: boolean }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === "password";

  return <label className="block text-sm font-medium text-gray-700">{label}<span className="relative mt-1 block"><input type={isPassword && passwordVisible ? "text" : type} value={value} disabled={disabled} autoComplete={isPassword ? "new-password" : undefined} onChange={(e) => onChange?.(e.target.value)} className={`w-full rounded-lg border px-3 py-2 ${isPassword ? "pr-11" : ""} focus:border-transparent focus:ring-2 focus:ring-[#C6A24A] ${disabled ? "border-gray-200 bg-gray-50 text-gray-500" : "border-gray-300"}`} />{isPassword && <button type="button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} aria-pressed={passwordVisible} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-500 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C6A24A]">{passwordVisible ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}</button>}</span></label>;
}
