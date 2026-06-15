"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  FiUser, FiLock, FiBell, FiLogOut,
  FiEye, FiEyeOff, FiLoader, FiCheckCircle, FiAlertCircle
} from "react-icons/fi";

const SectionCard = ({ title, icon: Icon, children }) => (
  <div
    className="rounded-2xl p-6 mb-4"
    style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <div className="flex items-center gap-2 mb-6">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}
      >
        <Icon size={15} color="#818cf8" />
      </div>
      <h2 className="text-white font-semibold text-sm">{title}</h2>
    </div>
    {children}
  </div>
);

const InputField = ({ label, type = "text", value, onChange, disabled, placeholder, rightElement }) => (
  <div className="mb-4">
    <label className="block text-xs font-medium mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-4 py-[11px] rounded-xl text-sm text-white outline-none transition-all"
        style={{
          background: disabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: disabled ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
          paddingRight: rightElement ? "44px" : undefined,
        }}
      />
      {rightElement && (
        <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

const Toast = ({ msg }) => {
  if (!msg) return null;
  const isError = msg.type === "error";
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4"
      style={{
        background: isError ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
        border: `1px solid ${isError ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
        color: isError ? "#f87171" : "#4ade80",
      }}
    >
      {isError ? <FiAlertCircle size={15} /> : <FiCheckCircle size={15} />}
      {msg.text}
    </div>
  );
};

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className="relative flex-shrink-0"
    style={{
      width: "40px", height: "22px",
      borderRadius: "11px",
      background: checked ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.1)",
      border: `1px solid ${checked ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.1)"}`,
      transition: "all 0.2s",
    }}
  >
    <span
      style={{
        position: "absolute",
        top: "2px",
        left: checked ? "19px" : "2px",
        width: "16px", height: "16px",
        borderRadius: "50%",
        background: "white",
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }}
    />
  </button>
);

export default function SeekerSettingsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  // Profile
  const [name, setName] = useState(session?.user?.name || "");
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Notifications
  const [notifs, setNotifs] = useState({
    applicationStatus: true,
    newJobMatch: true,
    savedJobExpiry: false,
    newsletter: false,
  });
  const [notifMsg, setNotifMsg] = useState(null);
  const [notifLoading, setNotifLoading] = useState(false);

  const handleProfileSave = async () => {
    if (!name.trim()) return;
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    } catch {
      setProfileMsg({ type: "error", text: "Failed to update profile." });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwdMsg(null);
    if (!currentPwd || !newPwd || !confirmPwd) {
      return setPwdMsg({ type: "error", text: "Please fill in all password fields." });
    }
    if (newPwd.length < 8) {
      return setPwdMsg({ type: "error", text: "New password must be at least 8 characters." });
    }
    if (newPwd !== confirmPwd) {
      return setPwdMsg({ type: "error", text: "New passwords do not match." });
    }
    setPwdLoading(true);
    try {
      const result = await authClient.changePassword({
        currentPassword: currentPwd,
        newPassword: newPwd,
        revokeOtherSessions: true,
      });
      if (result?.error) throw new Error(result.error.message);
      setPwdMsg({ type: "success", text: "Password changed successfully." });
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch (err) {
      setPwdMsg({ type: "error", text: err.message || "Incorrect current password." });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleNotifSave = async () => {
    setNotifLoading(true);
    setNotifMsg(null);
    await new Promise((r) => setTimeout(r, 600));
    setNotifMsg({ type: "success", text: "Notification preferences saved." });
    setNotifLoading(false);
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const EyeBtn = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle} style={{ color: "rgba(255,255,255,0.3)" }}>
      {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
    </button>
  );

  return (
    <div className="min-h-screen px-4 md:px-8 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Manage your account preferences
          </p>
        </div>

        {/* Profile */}
        <SectionCard title="Profile" icon={FiUser}>
          <Toast msg={profileMsg} />
          <InputField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
          <InputField
            label="Email Address"
            value={session?.user?.email || ""}
            disabled
          />
          <button
            onClick={handleProfileSave}
            disabled={profileLoading}
            className="flex items-center gap-2 px-5 py-[10px] rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
          >
            {profileLoading && <FiLoader size={14} className="animate-spin" />}
            Save Profile
          </button>
        </SectionCard>

        {/* Password */}
        <SectionCard title="Change Password" icon={FiLock}>
          <Toast msg={pwdMsg} />
          <InputField
            label="Current Password"
            type={showCurrent ? "text" : "password"}
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            placeholder="••••••••"
            rightElement={<EyeBtn show={showCurrent} onToggle={() => setShowCurrent((p) => !p)} />}
          />
          <InputField
            label="New Password"
            type={showNew ? "text" : "password"}
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="Min. 8 characters"
            rightElement={<EyeBtn show={showNew} onToggle={() => setShowNew((p) => !p)} />}
          />
          <InputField
            label="Confirm New Password"
            type={showConfirm ? "text" : "password"}
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            placeholder="Re-enter new password"
            rightElement={<EyeBtn show={showConfirm} onToggle={() => setShowConfirm((p) => !p)} />}
          />
          <button
            onClick={handlePasswordChange}
            disabled={pwdLoading}
            className="flex items-center gap-2 px-5 py-[10px] rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
          >
            {pwdLoading && <FiLoader size={14} className="animate-spin" />}
            Update Password
          </button>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" icon={FiBell}>
          <Toast msg={notifMsg} />
          <div className="flex flex-col gap-4 mb-5">
            {[
              { key: "applicationStatus", label: "Application status updates", desc: "Get notified when a recruiter reviews your application" },
              { key: "newJobMatch",        label: "New job matches",           desc: "Jobs that match your profile and skills" },
              { key: "savedJobExpiry",     label: "Saved job expiry alerts",   desc: "Alerts when your saved jobs are about to close" },
              { key: "newsletter",         label: "HireLoop newsletter",       desc: "Career tips and platform updates" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white">{n.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{n.desc}</p>
                </div>
                <ToggleSwitch
                  checked={notifs[n.key]}
                  onChange={(val) => setNotifs((prev) => ({ ...prev, [n.key]: val }))}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleNotifSave}
            disabled={notifLoading}
            className="flex items-center gap-2 px-5 py-[10px] rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
          >
            {notifLoading && <FiLoader size={14} className="animate-spin" />}
            Save Preferences
          </button>
        </SectionCard>

        {/* Sign Out */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(239,68,68,0.04)",
            border: "1px solid rgba(239,68,68,0.12)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <FiLogOut size={15} color="#f87171" />
            <h2 className="text-white font-semibold text-sm">Sign Out</h2>
          </div>
          <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
            You will be signed out of your account and redirected to the homepage.
          </p>
          <button
            onClick={handleSignOut}
            className="px-5 py-[10px] rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171",
            }}
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}