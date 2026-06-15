"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiBell,
  FiShield,
  FiLogOut,
} from "react-icons/fi";

const Section = ({ title, children }) => (
  <div
    className="rounded-2xl p-6 flex flex-col gap-5"
    style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <h2 className="text-sm font-semibold text-white">{title}</h2>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "13px",
  padding: "10px 14px",
  outline: "none",
  width: "100%",
};

const inputFocusClass =
  "focus:border-indigo-500/50 transition-colors duration-200";

const StatusBox = ({ status }) => {
  if (!status) return null;
  const isSuccess = status.type === "success";
  return (
    <div
      className="flex items-start gap-2 p-3 rounded-xl"
      style={{
        background: isSuccess ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
        border: isSuccess
          ? "1px solid rgba(34,197,94,0.25)"
          : "1px solid rgba(239,68,68,0.25)",
      }}
    >
      {isSuccess ? (
        <FiCheckCircle size={14} color="#4ade80" style={{ flexShrink: 0, marginTop: 1 }} />
      ) : (
        <FiAlertCircle size={14} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
      )}
      <p
        className="text-xs"
        style={{ color: isSuccess ? "rgba(74,222,128,0.9)" : "rgba(248,113,113,0.9)" }}
      >
        {status.message}
      </p>
    </div>
  );
};

export default function RecruiterSettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Profile form
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [profileStatus, setProfileStatus] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState({
    newApplication: true,
    statusUpdate: true,
    weeklyReport: false,
    marketing: false,
  });
  const [notifStatus, setNotifStatus] = useState(null);

  // Sign out
  const [signingOut, setSigningOut] = useState(false);

  // Populate profile from session
  useEffect(() => {
    if (session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  // ── Handlers ──

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      setProfileStatus({ type: "error", message: "Name cannot be empty." });
      return;
    }
    setProfileLoading(true);
    setProfileStatus(null);
    try {
      // BetterAuth profile update — adapt to your auth-client if needed
      await new Promise((r) => setTimeout(r, 800)); // replace with real API call
      setProfileStatus({ type: "success", message: "Profile updated successfully." });
    } catch {
      setProfileStatus({ type: "error", message: "Failed to update profile." });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPasswordStatus({ type: "error", message: "Please fill in all password fields." });
      return;
    }
    if (passwords.newPass.length < 8) {
      setPasswordStatus({ type: "error", message: "New password must be at least 8 characters." });
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPasswordStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    setPasswordLoading(true);
    try {
      await authClient.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
        revokeOtherSessions: true,
      });
      setPasswordStatus({ type: "success", message: "Password changed successfully." });
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      setPasswordStatus({
        type: "error",
        message: err?.message || "Failed to change password.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotifSave = async () => {
    setNotifStatus(null);
    await new Promise((r) => setTimeout(r, 500));
    setNotifStatus({ type: "success", message: "Notification preferences saved." });
    setTimeout(() => setNotifStatus(null), 3000);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/") },
    });
  };

  if (isPending) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "#0a0a0a" }}
      >
        <FiLoader size={22} color="#6366f1" className="animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 md:px-8 py-10"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {/* Page title */}
        <div className="mb-2">
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Manage your account preferences
          </p>
        </div>

        {/* ── Profile Section ── */}
        <Section title="Profile Information">
          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            {/* Avatar row */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
              >
                {profile.name?.charAt(0)?.toUpperCase() || "R"}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{profile.name}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Recruiter Account
                </p>
              </div>
            </div>

            <Field label="Full Name">
              <div className="relative">
                <FiUser
                  size={13}
                  color="rgba(255,255,255,0.25)"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className={inputFocusClass}
                  style={{ ...inputStyle, paddingLeft: 36 }}
                  placeholder="Your full name"
                />
              </div>
            </Field>

            <Field label="Email Address">
              <div className="relative">
                <FiMail
                  size={13}
                  color="rgba(255,255,255,0.25)"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  style={{
                    ...inputStyle,
                    paddingLeft: 36,
                    opacity: 0.45,
                    cursor: "not-allowed",
                  }}
                />
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                Email cannot be changed here.
              </p>
            </Field>

            <StatusBox status={profileStatus} />

            <button
              type="submit"
              disabled={profileLoading}
              className="self-start px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                color: "#fff",
                opacity: profileLoading ? 0.7 : 1,
              }}
            >
              {profileLoading && <FiLoader size={13} className="animate-spin" />}
              Save Changes
            </button>
          </form>
        </Section>

        {/* ── Password Section ── */}
        <Section title="Change Password">
          <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">

            {/* Current password */}
            <Field label="Current Password">
              <div className="relative">
                <FiLock
                  size={13}
                  color="rgba(255,255,255,0.25)"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className={inputFocusClass}
                  style={{ ...inputStyle, paddingLeft: 36, paddingRight: 40 }}
                  placeholder="Current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}
                >
                  {showCurrent
                    ? <FiEyeOff size={14} color="rgba(255,255,255,0.3)" />
                    : <FiEye size={14} color="rgba(255,255,255,0.3)" />}
                </button>
              </div>
            </Field>

            {/* New password */}
            <Field label="New Password">
              <div className="relative">
                <FiLock
                  size={13}
                  color="rgba(255,255,255,0.25)"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  type={showNew ? "text" : "password"}
                  value={passwords.newPass}
                  onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                  className={inputFocusClass}
                  style={{ ...inputStyle, paddingLeft: 36, paddingRight: 40 }}
                  placeholder="New password (min 8 chars)"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}
                >
                  {showNew
                    ? <FiEyeOff size={14} color="rgba(255,255,255,0.3)" />
                    : <FiEye size={14} color="rgba(255,255,255,0.3)" />}
                </button>
              </div>
            </Field>

            {/* Confirm password */}
            <Field label="Confirm New Password">
              <div className="relative">
                <FiLock
                  size={13}
                  color="rgba(255,255,255,0.25)"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className={inputFocusClass}
                  style={{ ...inputStyle, paddingLeft: 36, paddingRight: 40 }}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}
                >
                  {showConfirm
                    ? <FiEyeOff size={14} color="rgba(255,255,255,0.3)" />
                    : <FiEye size={14} color="rgba(255,255,255,0.3)" />}
                </button>
              </div>
            </Field>

            <StatusBox status={passwordStatus} />

            <button
              type="submit"
              disabled={passwordLoading}
              className="self-start px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                color: "#fff",
                opacity: passwordLoading ? 0.7 : 1,
              }}
            >
              {passwordLoading && <FiLoader size={13} className="animate-spin" />}
              Update Password
            </button>
          </form>
        </Section>

        {/* ── Notifications Section ── */}
        <Section title="Notification Preferences">
          <div className="flex flex-col gap-4">
            {[
              {
                key: "newApplication",
                label: "New Application",
                desc: "Get notified when someone applies to your job",
              },
              {
                key: "statusUpdate",
                label: "Status Updates",
                desc: "Alerts when application statuses change",
              },
              {
                key: "weeklyReport",
                label: "Weekly Report",
                desc: "Summary of your jobs and applicants every week",
              },
              {
                key: "marketing",
                label: "Product Updates",
                desc: "News about HireLoop features and announcements",
              },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white">{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {desc}
                  </p>
                </div>
                {/* Toggle */}
                <button
                  onClick={() =>
                    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  className="relative flex-shrink-0 w-10 h-5 rounded-full transition-all duration-200"
                  style={{
                    background: notifications[key]
                      ? "linear-gradient(135deg, #6366f1, #7c3aed)"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                    style={{ left: notifications[key] ? "22px" : "2px" }}
                  />
                </button>
              </div>
            ))}

            <StatusBox status={notifStatus} />

            <button
              onClick={handleNotifSave}
              className="self-start px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                color: "#fff",
              }}
            >
              Save Preferences
            </button>
          </div>
        </Section>

        {/* ── Danger Zone ── */}
        <Section title="Account">
          <div className="flex flex-col gap-3">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              Sign out from your current session on this device.
            </p>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
                opacity: signingOut ? 0.7 : 1,
              }}
            >
              {signingOut
                ? <FiLoader size={13} className="animate-spin" />
                : <FiLogOut size={13} />}
              Sign Out
            </button>
          </div>
        </Section>

      </div>
    </div>
  );
}