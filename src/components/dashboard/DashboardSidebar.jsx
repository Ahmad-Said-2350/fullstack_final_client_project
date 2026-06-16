"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  MdOutlineSpaceDashboard,
  MdOutlineBusinessCenter,
  MdOutlineWork,
  MdOutlinePeople,
  MdOutlineAssignment,
  MdOutlineSettings,
  MdOutlineBookmark,
} from "react-icons/md";

const recruiterLinks = [
  { label: "Dashboard", href: "/dashboard/recruiter", icon: MdOutlineSpaceDashboard },
  { label: "My Company", href: "/dashboard/recruiter/company", icon: MdOutlineBusinessCenter },
  { label: "Manage Jobs", href: "/dashboard/recruiter/jobs", icon: MdOutlineWork },
  { label: "Applications", href: "/dashboard/recruiter/applications", icon: MdOutlineAssignment },
  { label: "Billing", href: "/dashboard/recruiter/billing", icon: MdOutlineBusinessCenter },
  { label: "Settings", href: "/dashboard/recruiter/settings", icon: MdOutlineSettings },
];

const seekerLinks = [
  { label: "Dashboard", href: "/dashboard/seeker", icon: MdOutlineSpaceDashboard },
  { label: "Browse Jobs", href: "/jobs", icon: MdOutlineWork },
  { label: "Saved Jobs", href: "/dashboard/seeker/saved", icon: MdOutlineBookmark },
  { label: "Applications", href: "/dashboard/seeker/applications", icon: MdOutlineAssignment },
  { label: "Billing", href: "/dashboard/seeker/billing", icon: MdOutlineBusinessCenter },
  { label: "Settings", href: "/dashboard/seeker/settings", icon: MdOutlineSettings },
];

const adminLinks = [
  { label: "Dashboard", href: "/dashboard/admin/home", icon: MdOutlineSpaceDashboard },
  { label: "Companies", href: "/dashboard/admin/companies", icon: MdOutlineBusinessCenter },
  { label: "Manage Jobs", href: "/dashboard/admin/jobs", icon: MdOutlineWork },
  { label: "Users", href: "/dashboard/admin/users", icon: MdOutlinePeople },
];

const DashboardSidebar = ({ onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [plan, setPlan] = useState("free");

  const role = session?.user?.role || "Job Seeker";
  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;

    const fetchPlan = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-plan?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`
        );
        const d = await res.json();
        if (d?.plan) setPlan(d.plan);
      } catch {}
    };

    fetchPlan();
    const interval = setInterval(fetchPlan, 15000);
    return () => clearInterval(interval);
  }, [email, role]);

  const links = role === "Recruiter" ? recruiterLinks : role === "admin" ? adminLinks : seekerLinks;

  const getPlanLabel = () => {
    if (role === "Recruiter") {
      if (plan === "enterprise") return "ENTERPRISE";
      if (plan === "growth") return "GROWTH PLAN";
      return "FREE ACCOUNT";
    }
    if (plan === "premium") return "PREMIUM ACCOUNT";
    if (plan === "pro") return "PRO ACCOUNT";
    return "FREE ACCOUNT";
  };

  const getPlanStyle = () => {
    if (plan === "enterprise" || plan === "premium")
      return { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#fbbf24" };
    if (plan === "growth" || plan === "pro")
      return { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.3)", color: "#818cf8" };
    return { bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)", color: "#a5b4fc" };
  };

  const planStyle = getPlanStyle();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/") },
    });
  };

  return (
    <aside
      className="h-screen w-[220px] flex-shrink-0 flex flex-col"
      style={{
        background: "#0f0f0f",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="px-5 pt-6 pb-5">
        <Link href="/" onClick={() => onClose?.()} className="text-xl font-extrabold tracking-tight">
          <span className="text-white">Hire</span>
          <span style={{ color: "#6366f1" }}>Loop</span>
        </Link>
      </div>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 20px" }} />

      <div className="px-5 py-4 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
          >
            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-white leading-tight truncate">
              {session?.user?.name || "User"}
            </span>
            <span className="text-xs capitalize" style={{ color: "rgba(255,255,255,0.35)" }}>
              {role === "admin" ? "Admin" : role}
            </span>
          </div>
        </div>

        <div
          className="w-fit px-2 py-[3px] rounded text-[10px] font-bold tracking-widest uppercase"
          style={{
            background: planStyle.bg,
            border: `1px solid ${planStyle.border}`,
            color: planStyle.color,
          }}
        >
          {getPlanLabel()}
        </div>
      </div>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 20px 12px" }} />

      <nav className="flex flex-col gap-1 px-3 flex-1">
        {links.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/jobs" && pathname.startsWith(href + "/"));
          return (
            <Link
              key={label}
              href={href}
              onClick={() => onClose?.()}
              className="flex items-center gap-3 px-3 py-[9px] rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                color: isActive ? "#a5b4fc" : "rgba(255,255,255,0.45)",
                borderLeft: isActive ? "2px solid #6366f1" : "2px solid transparent",
              }}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6">
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "12px" }} />
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-[9px] rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-500/10"
          style={{ color: "rgba(239,68,68,0.7)" }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;