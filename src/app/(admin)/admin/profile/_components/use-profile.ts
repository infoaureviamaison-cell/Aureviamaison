"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export function useProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [requestId, setRequestId] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { void fetchProfile(); }, []);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      if (data.admin) { setName(data.admin.name || ""); setEmail(data.admin.email); }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile() {
    setSaving(true); setMessage("");
    try {
      const res = await fetch("/api/admin/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      if (res.ok) { setMessage("Profile updated!"); setTimeout(() => setMessage(""), 3000); }
    } catch {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleRequestPasswordChange() {
    if (newPassword !== confirmPassword) return setMessage("Passwords don't match");
    if (newPassword.length < 10 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) return setMessage("Use 10+ characters with uppercase, lowercase, and a number");
    setSaving(true); setMessage("");
    try {
      const res = await fetch("/api/admin/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "request", currentPassword, newPassword }) });
      const data = await res.json();
      if (res.ok) { setRequestId(data.requestId); setEmailHint(data.emailHint); setMessage("Verification code sent"); }
      else setMessage(data.error || "Failed to send verification code");
    } catch {
      setMessage("Failed to send verification code");
    } finally {
      setSaving(false);
    }
  }

  async function handleVerifyPasswordChange() {
    if (otp.length !== 6) return setMessage("Enter the 6-digit verification code");
    setSaving(true); setMessage("");
    try {
      const res = await fetch("/api/admin/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify", requestId, otp }) });
      const data = await res.json();
      if (!res.ok) return setMessage(data.error || "Verification failed");
      setMessage("Password changed. Redirecting to sign in...");
      await signOut({ callbackUrl: "/admin/login" });
    } catch {
      setMessage("Verification failed");
    } finally {
      setSaving(false);
    }
  }

  function restartPasswordChange() {
    setRequestId(""); setOtp(""); setEmailHint(""); setMessage("");
  }

  return { name, setName, email, currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, otp, setOtp, requestId, emailHint, loading, saving, message, handleUpdateProfile, handleRequestPasswordChange, handleVerifyPasswordChange, restartPasswordChange };
}
