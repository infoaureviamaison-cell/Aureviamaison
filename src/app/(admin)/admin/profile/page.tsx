"use client";

import { AccountPanel, Message, PasswordPanel } from "./_components/profile-panels";
import { useProfile } from "./_components/use-profile";
import { AdminAccountsPanel } from "./_components/admin-accounts-panel";

export default function ProfilePage() {
  const state = useProfile();
  if (state.loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-[#0a0a0a]">Profile</h1>
      <Message message={state.message} />
      <div className="max-w-2xl space-y-6">
        <AccountPanel name={state.name} setName={state.setName} email={state.email} saving={state.saving} onSave={state.handleUpdateProfile} />
        <PasswordPanel currentPassword={state.currentPassword} setCurrentPassword={state.setCurrentPassword} newPassword={state.newPassword} setNewPassword={state.setNewPassword} confirmPassword={state.confirmPassword} setConfirmPassword={state.setConfirmPassword} otp={state.otp} setOtp={state.setOtp} requestId={state.requestId} emailHint={state.emailHint} saving={state.saving} onRequest={state.handleRequestPasswordChange} onVerify={state.handleVerifyPasswordChange} onRestart={state.restartPasswordChange} />
        <AdminAccountsPanel />
      </div>
    </div>
  );
}
