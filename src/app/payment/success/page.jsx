"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { FiCheckCircle, FiLoader } from "react-icons/fi";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const plan = searchParams.get("plan") || "pro";
  const type = searchParams.get("type") === "recruiter" ? "recruiter" : "seeker";
  const emailParam = searchParams.get("email");

  const email = session?.user?.email || emailParam;
  const isRecruiter =
    session?.user?.role === "Recruiter" || type === "recruiter";

  const dashboardUrl = isRecruiter ? "/dashboard/recruiter" : "/dashboard/seeker";

  const [countdown, setCountdown] = useState(5);
  const [verifying, setVerifying] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const savedRef = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (!email) return;
    if (savedRef.current) return;

    const savePlan = async () => {
      try {
        savedRef.current = true;

        const base = process.env.NEXT_PUBLIC_API_URL;
        if (!base) {
          throw new Error("NEXT_PUBLIC_API_URL is missing");
        }

        const endpoint = isRecruiter
          ? `${base}/recruiter/billing`
          : `${base}/user/plan`;

        const res = await fetch(endpoint, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, plan }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.message || `Request failed: ${res.status}`);
        }

        setConfirmed(true);
      } catch (err) {
        console.error("Plan save error:", err);
        setErrorMsg(err?.message || "Plan save failed");
        setConfirmed(true);
      } finally {
        setVerifying(false);
      }
    };

    savePlan();
  }, [email, plan, isRecruiter, isPending]);

  useEffect(() => {
    if (!confirmed) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [confirmed]);

  useEffect(() => {
    if (countdown === 0 && confirmed) {
      router.push(dashboardUrl);
    }
  }, [countdown, confirmed, router, dashboardUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
      <div className="text-center max-w-md w-full">
        {verifying ? (
          <div className="flex flex-col items-center gap-4">
            <FiLoader size={36} color="#6366f1" className="animate-spin" />
            <p className="text-white font-medium">Activating your plan...</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Please wait a moment.
            </p>
          </div>
        ) : (
          <>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.3)" }}
            >
              <FiCheckCircle size={36} color="#4ade80" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">Payment Successful! 🎉</h1>

            {errorMsg ? (
              <p className="text-sm mb-4" style={{ color: "#fca5a5" }}>
                {errorMsg}
              </p>
            ) : null}

            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
              Your account has been upgraded. Redirecting in{" "}
              <span className="text-white font-semibold">{countdown}</span> seconds...
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={dashboardUrl}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
              >
                Go to Dashboard
              </Link>

              <Link
                href={isRecruiter ? "/dashboard/recruiter/jobs/new" : "/jobs"}
                className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {isRecruiter ? "Post a Job" : "Browse Jobs"}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}