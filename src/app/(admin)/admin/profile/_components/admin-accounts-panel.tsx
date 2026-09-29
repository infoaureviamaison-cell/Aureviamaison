"use client";

import { useCallback, useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiMail, FiPlus, FiUsers } from "react-icons/fi";

type AdminAccount = { id: string; email: string; name: string | null; isPrimary: boolean };
type Mode = "create" | "change";

export function AdminAccountsPanel() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [mode, setMode] = useState<Mode>("create");
  const [targetAdminId, setTargetAdminId] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadAdmins = useCallback(async () => {
    const response = await fetch("/api/admin/accounts");
    const data = await response.json();
    if (response.ok) setAdmins(data.admins);
    else setMessage(data.error || "Failed to load admin accounts");
  }, []);

  useEffect(() => { void loadAdmins(); }, [loadAdmins]);

  function reset() {
    setRequestId(""); setOtp(""); setEmailHint(""); setNewEmail(""); setPassword(""); setConfirmPassword(""); setMessage("");
  }

  async function requestChange() {
    if (mode === "create" && password !== confirmPassword) return setMessage("Passwords don't match");
    if (mode === "change" && !targetAdminId) return setMessage("Select a secondary admin");
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode === "create" ? "request-create" : "request-email-change", targetAdminId, newEmail, password }),
      });
      const data = await response.json();
      if (!response.ok) return setMessage(data.error || "Request failed");
      setRequestId(data.requestId); setEmailHint(data.emailHint); setMessage("Verification code sent");
    } catch { setMessage("Request failed"); } finally { setBusy(false); }
  }

  async function verify() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/accounts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", requestId, otp }),
      });
      const data = await response.json();
      if (!response.ok) return setMessage(data.error || "Verification failed");
      reset(); await loadAdmins(); setMessage(mode === "create" ? "New admin created" : "Admin email changed");
    } catch { setMessage("Verification failed"); } finally { setBusy(false); }
  }

  const secondaryAdmins = admins.filter((admin) => !admin.isPrimary);

  return <div className="rounded-lg bg-white p-6 shadow">
    <h2 className="flex items-center gap-2 text-lg font-semibold"><FiUsers className="h-5 w-5" />Admin Accounts</h2>
    <p className="mt-1 text-sm text-gray-500">Create additional admin logins or change a secondary admin email. Security codes always go to the protected Auerviamaison email.</p>
    <p className="mt-1 text-sm text-gray-500">Create additional admin logins or change a secondary admin email. Security codes always go to the protected Auerviamaison email.</p>
    <div className="mt-4 space-y-2">{admins.map((admin) => <div key={admin.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"><span>{admin.email}</span>{admin.isPrimary && <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Primary & protected</span>}</div>)}</div>
    <div className="mt-5 flex gap-2"><button type="button" onClick={() => { reset(); setMode("create"); }} className={`rounded-lg px-3 py-2 text-sm ${mode === "create" ? "bg-[#C6A24A] text-white" : "bg-gray-100"}`}><FiPlus className="mr-1 inline" />Add admin</button><button type="button" onClick={() => { reset(); setMode("change"); }} className={`rounded-lg px-3 py-2 text-sm ${mode === "change" ? "bg-[#C6A24A] text-white" : "bg-gray-100"}`}><FiMail className="mr-1 inline" />Change email</button></div>
    {message && <div className={`mt-4 rounded-lg p-3 text-sm ${message.includes("created") || message.includes("changed") || message.includes("sent") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{message}</div>}
    {!requestId ? <div className="mt-4 space-y-4">
      {mode === "change" && <label className="block text-sm font-medium text-gray-700">Secondary admin<select value={targetAdminId} onChange={(event) => setTargetAdminId(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"><option value="">Select admin</option>{secondaryAdmins.map((admin) => <option key={admin.id} value={admin.id}>{admin.email}</option>)}</select></label>}
      <label className="block text-sm font-medium text-gray-700">{mode === "create" ? "Admin email" : "New email"}<input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#C6A24A]" /></label>
      {mode === "create" && <><PasswordInput label="Temporary password" value={password} setValue={setPassword} visible={passwordVisible} toggle={() => setPasswordVisible((value) => !value)} /><PasswordInput label="Confirm password" value={confirmPassword} setValue={setConfirmPassword} visible={passwordVisible} toggle={() => setPasswordVisible((value) => !value)} /><p className="text-xs text-gray-500">Use at least 10 characters with uppercase, lowercase, and a number.</p></>}
      <button type="button" onClick={requestChange} disabled={busy || !newEmail || (mode === "create" && (!password || !confirmPassword))} className="rounded-lg bg-[#1E6332] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Sending..." : "Continue & send OTP"}</button>
    </div> : <div className="mt-4 space-y-4"><p className="text-sm text-gray-600">Enter the code sent to <strong>{emailHint}</strong>.</p><label className="block text-sm font-medium">6-digit OTP<input inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} className="mt-1 w-full rounded-lg border px-3 py-2 tracking-[0.4em]" /></label><div className="flex gap-2"><button onClick={verify} disabled={busy || otp.length !== 6} className="rounded-lg bg-[#1E6332] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Verifying..." : "Verify & save"}</button><button onClick={reset} disabled={busy} className="rounded-lg border px-4 py-2 text-sm">Cancel</button></div></div>}
  </div>;
}

function PasswordInput({ label, value, setValue, visible, toggle }: { label: string; value: string; setValue: (value: string) => void; visible: boolean; toggle: () => void }) {
  return <label className="block text-sm font-medium text-gray-700">{label}<span className="relative mt-1 block"><input type={visible ? "text" : "password"} value={value} onChange={(event) => setValue(event.target.value)} autoComplete="new-password" className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11" /><button type="button" onClick={toggle} aria-label={visible ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-500">{visible ? <FiEyeOff /> : <FiEye />}</button></span></label>;
}
