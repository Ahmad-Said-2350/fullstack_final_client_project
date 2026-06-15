// ════════════════════════════════════════════
// app/dashboard/admin/layout.jsx
// Admin Dashboard uses the SAME layout as other dashboards
// (DashboardSidebar already handles admin links)
// So just re-export the existing layout — no new file needed!
//
// Your app/dashboard/layout.jsx already wraps ALL dashboard routes.
// Admin pages at /dashboard/admin/* will automatically get the sidebar.
// ════════════════════════════════════════════

// app/dashboard/admin/page.jsx  ← redirect page
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session || session.user?.role !== "admin") {
      router.push("/sign-in");
      return;
    }
    router.push("/dashboard/admin/companies");
  }, [session, isPending, router]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "#0a0a0a" }}>
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: "#6366f1", borderTopColor: "transparent" }} />
    </div>
  );
}