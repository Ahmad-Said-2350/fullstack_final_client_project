"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  FiZap, FiStar, FiLoader, FiCheckCircle,
  FiAlertCircle, FiCreditCard, FiCalendar
} from "react-icons/fi";
import { MdWorkspacePremium } from "react-icons/md";

const planConfig = {
  free: {
    name: "Free",
    price: "$0",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.2)",
    icon: FiZap,
    limit: "3 applications/month",
    features: ["3 job applications/month", "Save unlimited jobs", "Basic job search"],
  },
  pro: {
    name: "Pro",
    price: "$19/mo",
    color: "#818cf8",
    bg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.3)",
    icon: FiStar,
    limit: "30 applications/month",
    features: ["30 job applications/month", "Priority visibility", "Resume highlight badge", "Application analytics"],
  },
  premium: {
    name: "Premium",
    price: "$39/mo",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.3)",
    icon: MdWorkspacePremium,
    limit: "Unlimited applications",
    features: ["Unlimited applications", "Top applicant badge", "Direct recruiter messaging", "AI resume suggestions", "Priority support"],
  },
};

export default function BillingPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!session?.user?.email) return;
    // eslint-disable-next-line react-hooks/immutability
    fetchPlan();
  }, [session]);

  const fetchPlan = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/plan?email=${session.user.email}`
      );
      const data = await res.json();
      setPlanData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    setMsg(null);
    setUpgradeLoading(planId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email, plan: planId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      window.location.href = data.url;
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Something went wrong." });
      setUpgradeLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll be downgraded to Free.")) return;
    setCancelLoading(true);
    setMsg(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cancel-subscription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg({ type: "success", text: "Subscription cancelled. You've been moved to the Free plan." });
      fetchPlan();
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to cancel subscription." });
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0a0a0a" }}>
        <FiLoader size={22} color="#6366f1" className="animate-spin" />
      </div>
    );
  }

  const currentPlan = planData?.plan || "free";
  const config = planConfig[currentPlan];
  const Icon = config.icon;
  const used = planData?.appliedThisMonth || 0;
  const limit = planData?.applyLimit || 3;

const usagePercent = limit >= 999 ? 30 : Math.min((used / limit) * 100, 100);
const barColor =
  currentPlan === "premium"
    ? "linear-gradient(90deg, #f59e0b, #fbbf24)"   // ← Premium: golden
    : currentPlan === "pro"
    ? "linear-gradient(90deg, #6366f1, #8b5cf6)"   // ← Pro: purple
    : usagePercent >= 90
    ? "#f87171"                                      // ← Free near limit: red
    : "linear-gradient(90deg, #6366f1, #8b5cf6)";  // ← Free normal: purple
  
  return (
    <div className="min-h-screen px-4 md:px-8 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">Billing & Plan</h1>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Manage your subscription and usage
          </p>
        </div>

        {/* Toast */}
        {msg && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-6"
            style={{
              background: msg.type === "error" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
              border: `1px solid ${msg.type === "error" ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
              color: msg.type === "error" ? "#f87171" : "#4ade80",
            }}
          >
            {msg.type === "error" ? <FiAlertCircle size={15} /> : <FiCheckCircle size={15} />}
            {msg.text}
          </div>
        )}

        {/* Current Plan Card */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: config.bg, border: `1px solid ${config.border}` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${config.border}` }}
              >
                <Icon size={18} color={config.color} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-white font-bold">{config.name} Plan</h2>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}
                  >
                    Active
                  </span>
                </div>
                <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {config.price} · {config.limit}
                </p>
              </div>
            </div>

            {/* Cancel button for paid plans */}
            {currentPlan !== "free" && (
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171",
                }}
              >
                {cancelLoading && <FiLoader size={12} className="animate-spin" />}
                Cancel Subscription
              </button>
            )}
          </div>

          {/* Usage bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                Applications this month
              </span>
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                {used} / {limit >= 999 ? "∞" : limit}
              </span>
            </div>
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full transition-all"
               style={{
  width: `${limit >= 999 ? 30 : usagePercent}%`,
  background: currentPlan === "premium" || currentPlan === "pro"
    ? "transparent"
    : barColor,
  backgroundImage: currentPlan === "premium"
    ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
    : currentPlan === "pro"
    ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
    : "none",
  backgroundColor: currentPlan === "free"
    ? (usagePercent >= 90 ? "#f87171" : "#6366f1")
    : "transparent",
}}
              />
            </div>
          </div>

          {/* Features */}
          <div className="mt-5 flex flex-wrap gap-2">
            {config.features.map((f) => (
              <span
                key={f}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                ✓ {f}
              </span>
            ))}
          </div>
        </div>

        {/* Upgrade Options */}
        {currentPlan !== "premium" && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h3 className="text-white font-semibold mb-1">Upgrade your plan</h3>
            <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Get more applications and unlock premium features
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Pro */}
              {currentPlan === "free" && (
                <div
                  className="flex-1 rounded-xl p-4"
                  style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiStar size={14} color="#818cf8" />
                    <span className="text-white font-semibold text-sm">Pro</span>
                    <span className="text-xs ml-auto font-bold" style={{ color: "#818cf8" }}>$19/mo</span>
                  </div>
                  <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                    30 applications/month + priority visibility
                  </p>
                  <button
                    onClick={() => handleUpgrade("pro")}
                    disabled={!!upgradeLoading}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
                  >
                    {upgradeLoading === "pro" && <FiLoader size={12} className="animate-spin" />}
                    {upgradeLoading === "pro" ? "Redirecting..." : "Upgrade to Pro →"}
                  </button>
                </div>
              )}

              {/* Premium */}
              <div
                className="flex-1 rounded-xl p-4"
                style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MdWorkspacePremium size={14} color="#f59e0b" />
                  <span className="text-white font-semibold text-sm">Premium</span>
                  <span className="text-xs ml-auto font-bold" style={{ color: "#f59e0b" }}>$39/mo</span>
                </div>
                <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Unlimited applications + all features
                </p>
                <button
                  onClick={() => handleUpgrade("premium")}
                  disabled={!!upgradeLoading}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #d97706, #b45309)" }}
                >
                  {upgradeLoading === "premium" && <FiLoader size={12} className="animate-spin" />}
                  {upgradeLoading === "premium" ? "Redirecting..." : "Upgrade to Premium →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Info */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <FiCreditCard size={14} color="rgba(255,255,255,0.4)" />
            <h3 className="text-sm font-semibold text-white">Payment Info</h3>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            Payments are processed securely by Stripe. We never store your card details.
            {currentPlan !== "free" && " Your subscription renews monthly automatically."}
          </p>
          <button
            onClick={() => router.push("/pricing")}
            className="mt-3 text-xs font-medium"
            style={{ color: "#818cf8" }}
          >
            View all plans →
          </button>
        </div>

      </div>
    </div>
  );
}