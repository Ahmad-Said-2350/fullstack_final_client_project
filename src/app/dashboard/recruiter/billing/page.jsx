"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  FiCheck, FiZap, FiBriefcase, FiLoader, FiCheckCircle,
  FiAlertCircle, FiTrendingUp
} from "react-icons/fi";
import { MdWorkspacePremium } from "react-icons/md";

const plans = [
  {
    id: "free",
    name: "Free",
    icon: FiZap,
    price: 0,
    jobLimit: 3,
    description: "Great for your first year of hiring",
    features: ["Up to 3 active job posts", "Basic applicant management", "Standard listing visibility"],
    gradient: null,
    border: "rgba(255,255,255,0.08)",
  },
  {
    id: "growth",
    name: "Growth",
    icon: FiBriefcase,
    price: 49,
    jobLimit: 10,
    description: "Scale your hiring pipeline",
    features: ["Up to 10 active job posts", "Applicant tracking", "Basic analytics", "Email support"],
    gradient: "linear-gradient(135deg, #6366f1, #7c3aed)",
    border: "rgba(99,102,241,0.4)",
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: MdWorkspacePremium,
    price: 149,
    jobLimit: 50,
    description: "Advanced tools for hiring teams",
    features: ["Up to 50 active job posts", "Advanced analytics dashboard", "Featured job listings", "Team collaboration & custom branding", "Priority support"],
    gradient: "linear-gradient(135deg, #d97706, #b45309)",
    border: "rgba(245,158,11,0.3)",
    badge: "Best Value",
  },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function RecruiterBillingPage() {
  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();

  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgradingPlan, setUpgradingPlan] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  const email = session?.user?.email;

  useEffect(() => {
    const fetchBilling = async () => {
      if (!email) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recruiter/billing?email=${email}`);
        const data = await res.json();
        setBilling(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, [email]);

  // Stripe redirect message
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatusMsg({ type: "success", message: "Payment successful! Your plan will update shortly." });
    } else if (searchParams.get("canceled") === "true") {
      setStatusMsg({ type: "error", message: "Checkout was canceled." });
    }
  }, [searchParams]);

  const handleUpgrade = async (planId) => {
    if (!email) return;
    if (planId === "free") return;

    setUpgradingPlan(planId);
    setStatusMsg(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-recruiter-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan: planId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      if (!data.url) throw new Error("No checkout URL received");

      // eslint-disable-next-line react-hooks/immutability
      window.location.href = data.url;
    } catch (err) {
      setStatusMsg({ type: "error", message: err.message });
      setUpgradingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0a0a0a" }}>
        <FiLoader size={24} color="#6366f1" className="animate-spin" />
      </div>
    );
  }

  const currentPlan = billing?.plan || "free";
  const activeJobs = billing?.activeJobs || 0;
  const jobLimit = billing?.jobLimit || 3;
  const usagePercent = Math.min((activeJobs / jobLimit) * 100, 100);

  return (
    <div className="min-h-screen px-4 md:px-8 py-10" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-white">Subscription & Billing</h1>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Manage your plan and view active job post usage.
          </p>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className="flex items-start gap-2 p-3 rounded-xl"
            style={{
              background: statusMsg.type === "success" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border: statusMsg.type === "success" ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(239,68,68,0.25)",
            }}
          >
            {statusMsg.type === "success"
              ? <FiCheckCircle size={15} color="#4ade80" style={{ flexShrink: 0, marginTop: "1px" }} />
              : <FiAlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: "1px" }} />
            }
            <p className="text-xs" style={{ color: statusMsg.type === "success" ? "rgba(74,222,128,0.9)" : "rgba(248,113,113,0.9)" }}>
              {statusMsg.message}
            </p>
          </div>
        )}

        {/* Current Plan + Usage */}
        <div
          className="p-6 rounded-2xl flex flex-col gap-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Current Plan</p>
              <p className="text-lg font-bold text-white capitalize">{currentPlan}</p>
            </div>
            <div className="flex items-center gap-2">
              <FiTrendingUp size={14} color="#818cf8" />
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                {activeJobs} / {jobLimit} active job posts used
              </span>
            </div>
          </div>

          {/* Usage Bar */}
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${usagePercent}%`,
                background: usagePercent >= 100
                  ? "linear-gradient(90deg, #ef4444, #dc2626)"
                  : usagePercent >= 70
                  ? "linear-gradient(90deg, #f59e0b, #d97706)"
                  : "linear-gradient(90deg, #6366f1, #7c3aed)",
              }}
            />
          </div>

          {usagePercent >= 100 && (
            <p className="text-xs flex items-center gap-1" style={{ color: "#f87171" }}>
              <FiAlertCircle size={12} /> You've reached your active job post limit. Upgrade to post more jobs.
            </p>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.id;
            const isUpgrading = upgradingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className="relative flex flex-col p-6 rounded-2xl"
                style={{
                  background: plan.id === "growth" ? "rgba(99,102,241,0.05)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isCurrent ? "rgba(34,197,94,0.4)" : plan.border}`,
                }}
              >
                {/* Badge */}
                {plan.badge && !isCurrent && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                    style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}
                  >
                    {plan.badge}
                  </div>
                )}
                {isCurrent && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                    style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }}
                  >
                    Current Plan
                  </div>
                )}

                {/* Header */}
                <div className="mb-5 mt-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: plan.gradient || "rgba(255,255,255,0.05)", border: `1px solid ${plan.border}` }}
                  >
                    <Icon size={18} color={plan.gradient ? "white" : "rgba(255,255,255,0.5)"} />
                  </div>
                  <h2 className="text-lg font-bold text-white mb-1">{plan.name}</h2>
                  <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{plan.description}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    {plan.price > 0 && <span className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>/month</span>}
                  </div>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: plan.gradient || "rgba(255,255,255,0.08)" }}
                      >
                        <FiCheck size={10} color="white" strokeWidth={3} />
                      </div>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || isUpgrading || plan.id === "free"}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  style={
                    isCurrent || plan.id === "free"
                      ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)", cursor: "default" }
                      : { background: plan.gradient, color: "white", opacity: isUpgrading ? 0.7 : 1, cursor: isUpgrading ? "not-allowed" : "pointer" }
                  }
                >
                  {isUpgrading && <FiLoader size={14} className="animate-spin" />}
                  {isUpgrading ? "Redirecting..." : isCurrent ? "Current Plan" : plan.id === "free" ? "Free Plan" : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Payment History */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold text-white">Payment History</h2>
          </div>

          {(!billing?.paymentHistory || billing.paymentHistory.length === 0) ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>No payments yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["Date", "Plan", "Amount", "Transaction ID"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {billing.paymentHistory.map((p, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td className="px-5 py-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{formatDate(p.date)}</td>
                      <td className="px-5 py-4 text-sm capitalize" style={{ color: "rgba(255,255,255,0.5)" }}>{p.plan}</td>
                      <td className="px-5 py-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>${p.amount}</td>
                      <td className="px-5 py-4 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{p.transactionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}