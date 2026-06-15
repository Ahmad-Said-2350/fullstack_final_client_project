"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FiCheck, FiZap, FiLoader, FiStar } from "react-icons/fi";
import { MdWorkspacePremium } from "react-icons/md";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: null,
    description: "Get started with job hunting",
    icon: FiZap,
    iconColor: "#94a3b8",
    gradient: null,
    border: "rgba(255,255,255,0.08)",
    badge: null,
    features: [
      "Apply to 3 jobs per month",
      "Save unlimited jobs",
      "Basic job search & filters",
      "Application status tracking",
      "Email notifications",
    ],
    cta: "Current Plan",
    ctaDisabled: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    period: "month",
    description: "For serious job seekers",
    icon: FiStar,
    iconColor: "#818cf8",
    gradient: "linear-gradient(135deg, #6366f1, #7c3aed)",
    border: "rgba(99,102,241,0.4)",
    badge: "Most Popular",
    badgeColor: "#818cf8",
    badgeBg: "rgba(99,102,241,0.15)",
    features: [
      "Apply to 30 jobs per month",
      "Save unlimited jobs",
      "Advanced search & filters",
      "Priority application visibility",
      "Resume highlight badge",
      "Application analytics",
    ],
    cta: "Upgrade to Pro",
    ctaDisabled: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 39,
    period: "month",
    description: "Unlimited access, maximum results",
    icon: MdWorkspacePremium,
    iconColor: "#f59e0b",
    gradient: "linear-gradient(135deg, #d97706, #b45309)",
    border: "rgba(245,158,11,0.3)",
    badge: "Best Value",
    badgeColor: "#fbbf24",
    badgeBg: "rgba(245,158,11,0.12)",
    features: [
      "Unlimited job applications",
      "Save unlimited jobs",
      "Advanced search & filters",
      "Top applicant badge",
      "Direct recruiter messaging",
      "AI resume suggestions",
      "Priority support",
    ],
    cta: "Upgrade to Premium",
    ctaDisabled: false,
  },
];

export default function PricingPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState(null);

  const handleUpgrade = async (planId) => {
    if (!session?.user) {
      router.push("/sign-in");
      return;
    }

    setError(null);
    setLoadingPlan(planId);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          plan: planId,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");
      if (!data.url) throw new Error("No checkout URL received");

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#818cf8",
            }}
          >
            <FiZap size={12} /> Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose your plan
          </h1>
          <p className="text-lg" style={{ color: "rgba(255,255,255,0.45)" }}>
            Start free. Upgrade when you're ready to accelerate your job search.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-8 max-w-md mx-auto"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isLoading = loadingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className="relative rounded-2xl p-6 flex flex-col"
                style={{
                  background: plan.id === "pro"
                    ? "rgba(99,102,241,0.05)"
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${plan.border}`,
                  boxShadow: plan.id === "pro"
                    ? "0 0 40px rgba(99,102,241,0.08)"
                    : "none",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                    style={{ background: plan.badgeBg, color: plan.badgeColor, border: `1px solid ${plan.border}` }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: plan.gradient || "rgba(255,255,255,0.05)",
                      border: `1px solid ${plan.border}`,
                    }}
                  >
                    <Icon size={18} color={plan.gradient ? "white" : plan.iconColor} />
                  </div>

                  <h2 className="text-lg font-bold text-white mb-1">{plan.name}</h2>
                  <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {plan.description}
                  </p>

                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    {plan.period && (
                      <span className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: plan.gradient || "rgba(255,255,255,0.08)",
                        }}
                      >
                        <FiCheck size={10} color="white" strokeWidth={3} />
                      </div>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => !plan.ctaDisabled && handleUpgrade(plan.id)}
                  disabled={plan.ctaDisabled || isLoading}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  style={
                    plan.ctaDisabled
                      ? {
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.3)",
                          cursor: "default",
                        }
                      : {
                          background: plan.gradient,
                          color: "white",
                          opacity: isLoading ? 0.7 : 1,
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }
                  }
                >
                  {isLoading && <FiLoader size={14} className="animate-spin" />}
                  {isLoading ? "Redirecting..." : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-10" style={{ color: "rgba(255,255,255,0.25)" }}>
          All plans include a 7-day free trial. Cancel anytime. Payments are processed securely by Stripe.
        </p>

      </div>
    </div>
  );
}