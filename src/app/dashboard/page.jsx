"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/sign-in");
      return;
    }

    const role = session.user?.role;

    if (role === "Recruiter") {
      router.push("/dashboard/recruiter");
    } else if (role === "admin") {
      router.push("/dashboard/admin");
    } else {
      // "Job Seeker" বা অন্য যেকোনো role
      router.push("/dashboard/seeker");
    }
  }, [session, isPending, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}
      />
    </div>
  );
}