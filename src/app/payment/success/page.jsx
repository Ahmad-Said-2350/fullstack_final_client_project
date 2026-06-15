"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiLoader } from "react-icons/fi";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan") || "pro";
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard/seeker");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const planLabel = plan === "premium" ? "Premium" : "Pro";
  const planColor = plan === "premium" ? "#f59e0b" : "#818cf8";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0a0a" }}
    >
      <div className="text-center max-w-md">

        {/* Success Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "2px solid rgba(34,197,94,0.3)",
          }}
        >
          <FiCheckCircle size={36} color="#4ade80" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3">
          Payment Successful! 🎉
        </h1>

        {/* Plan Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
          style={{
            background: plan === "premium"
              ? "rgba(245,158,11,0.1)"
              : "rgba(99,102,241,0.1)",
            border: `1px solid ${plan === "premium" ? "rgba(245,158,11,0.3)" : "rgba(99,102,241,0.3)"}`,
            color: planColor,
          }}
        >
          ✨ You are now on the {planLabel} Plan
        </div>

        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
          Your account has been upgraded. You now have access to all {planLabel} features.
          Redirecting to your dashboard in {countdown} seconds...
        </p>

        {/* Features unlocked */}
        <div
          className="rounded-2xl p-5 mb-8 text-left"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
            WHAT'S UNLOCKED
          </p>
          <ul className="flex flex-col gap-2">
            {(plan === "premium"
              ? [
                  "Unlimited job applications",
                  "Top applicant badge",
                  "Direct recruiter messaging",
                  "AI resume suggestions",
                  "Priority support",
                ]
              : [
                  "30 job applications per month",
                  "Priority application visibility",
                  "Resume highlight badge",
                  "Application analytics",
                ]
            ).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                <span style={{ color: "#4ade80" }}>✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/seeker"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
          >
            Go to Dashboard
          </Link>
          <Link
            href="/jobs"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Browse Jobs
          </Link>
        </div>

        <p className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)" }}>
          A confirmation email has been sent to your registered address.
        </p>
      </div>
    </div>
  );
}