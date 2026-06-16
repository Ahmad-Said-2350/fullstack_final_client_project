"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { FiAlertTriangle, FiLoader, FiCheckCircle } from "react-icons/fi";

export default function CancelSubscriptionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const roleParam = searchParams.get("role");
  const typeParam = searchParams.get("type");

  const role =
    session?.user?.role ||
    (roleParam === "Recruiter" ? "Recruiter" : "Job Seeker");

  const isRecruiter = role === "Recruiter" || typeParam === "recruiter";
  const email = session?.user?.email;

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dashboardUrl = isRecruiter ? "/dashboard/recruiter" : "/dashboard/seeker";

  useEffect(() => {
    document.title = "Cancel Subscription | HireLoop";
  }, []);

  const handleCancel = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      if (!email) {
        throw new Error("No logged-in user found.");
      }

      const base = process.env.NEXT_PUBLIC_API_URL;
      if (!base) {
        throw new Error("NEXT_PUBLIC_API_URL is missing.");
      }

      const res = await fetch(`${base}/cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Cancel failed");
      }

      setDone(true);

      setTimeout(() => {
        router.push(dashboardUrl);
      }, 2500);
    } catch (err) {
      setErrorMsg(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
        <FiLoader size={36} className="animate-spin" color="#6366f1" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
      <div
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        {!done ? (
          <>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "2px solid rgba(239,68,68,0.25)",
              }}
            >
              <FiAlertTriangle size={34} color="#f87171" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">Cancel Subscription</h1>

            <p className="text-sm leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.65)" }}>
              You are about to cancel your {isRecruiter ? "recruiter" : "seeker"} subscription.
            </p>

            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
              After cancellation, your plan will switch to <span className="text-white font-semibold">free</span>.
            </p>

            {errorMsg ? (
              <div
                className="mb-5 rounded-2xl px-4 py-3 text-sm text-left"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.22)",
                  color: "#fca5a5",
                }}
              >
                {errorMsg}
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
              >
                {loading ? <FiLoader size={16} className="animate-spin" /> : null}
                {loading ? "Cancelling..." : "Yes, Cancel Subscription"}
              </button>

              <Link
                href={dashboardUrl}
                className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                Go Back
              </Link>
            </div>
          </>
        ) : (
          <>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "2px solid rgba(34,197,94,0.25)",
              }}
            >
              <FiCheckCircle size={34} color="#4ade80" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">Subscription Cancelled</h1>

            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              Your {isRecruiter ? "recruiter" : "seeker"} plan has been downgraded to free.
            </p>

            <Link
              href={dashboardUrl}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white inline-flex items-center justify-center transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
            >
              Continue to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}