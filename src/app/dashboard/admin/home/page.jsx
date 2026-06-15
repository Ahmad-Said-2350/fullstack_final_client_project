"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  FiUsers,
  FiLoader,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import {
  MdOutlineBusinessCenter,
  MdOutlinePeople,
  MdOutlineArticle,
  MdOutlineWork,
  MdOutlinePendingActions,
  MdOutlineVerified,
} from "react-icons/md";

export default function AdminDashboardHome() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      icon: MdOutlinePeople,
      label: "Total Users",
      value: stats?.totalUsers ?? "—",
      sub: `${stats?.totalRecruiters ?? 0} Recruiters · ${stats?.totalSeekers ?? 0} Seekers`,
      color: "#818cf8",
      bg: "rgba(99,102,241,0.1)",
    },
    {
      icon: MdOutlineBusinessCenter,
      label: "Total Companies",
      value: stats?.totalCompanies ?? "—",
      sub: `${stats?.pendingCompanies ?? 0} Pending · ${stats?.approvedCompanies ?? 0} Approved`,
      color: "#4ade80",
      bg: "rgba(34,197,94,0.1)",
    },
    {
      icon: MdOutlineWork,
      label: "Total Jobs",
      value: stats?.totalJobs ?? "—",
      sub: `${stats?.activeJobs ?? 0} Active`,
      color: "#facc15",
      bg: "rgba(234,179,8,0.1)",
    },
    {
      icon: MdOutlineArticle,
      label: "Total Applications",
      value: stats?.totalApplications ?? "—",
      sub: "All time",
      color: "#c084fc",
      bg: "rgba(168,85,247,0.1)",
    },
  ];

  const quickLinks = [
    {
      href: "/dashboard/admin/companies",
      label: "Pending Companies",
      desc: "Review and approve company registrations",
      icon: MdOutlinePendingActions,
      badge: stats?.pendingCompanies ?? 0,
      badgeColor: "#fbbf24",
    },
    {
      href: "/dashboard/admin/users",
      label: "Manage Users",
      desc: "View, suspend, or change user roles",
      icon: FiUsers,
      badge: stats?.totalUsers ?? 0,
      badgeColor: "#818cf8",
    },
    {
      href: "/dashboard/admin/jobs",
      label: "Manage Jobs",
      desc: "Review and remove job listings",
      icon: FiBriefcase,
      badge: stats?.totalJobs ?? 0,
      badgeColor: "#4ade80",
    },
  ];

  return (
    <div className="min-h-screen px-4 md:px-8 py-10" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-white">
            Admin Dashboard
          </h1>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Welcome back, {session?.user?.name || "Admin"}. Here's the platform overview.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader size={22} color="#6366f1" className="animate-spin" />
          </div>
        ) : (
          <>
            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {statCards.map(({ icon: Icon, label, value, sub, color, bg }) => (
                <div
                  key={label}
                  className="flex flex-col gap-4 p-5 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: bg, border: `1px solid ${color}22` }}
                  >
                    <Icon size={18} color={color} />
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {label}
                    </p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Quick Action Cards ── */}
            <div>
              <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {quickLinks.map(({ href, label, desc, icon: Icon, badge, badgeColor }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex flex-col gap-4 p-5 rounded-2xl transition-all hover:border-white/15"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Icon size={17} color="rgba(255,255,255,0.5)" />
                      </div>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${badgeColor}15`,
                          color: badgeColor,
                          border: `1px solid ${badgeColor}30`,
                        }}
                      >
                        {badge}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Pending Alert ── */}
            {stats?.pendingCompanies > 0 && (
              <Link
                href="/dashboard/admin/companies"
                className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:border-yellow-500/30"
                style={{
                  background: "rgba(251,191,36,0.05)",
                  border: "1px solid rgba(251,191,36,0.2)",
                }}
              >
                <MdOutlinePendingActions size={20} color="#fbbf24" />
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "#fbbf24" }}>
                    {stats.pendingCompanies} company registration{stats.pendingCompanies > 1 ? "s" : ""} pending review
                  </p>
                  <p className="text-xs" style={{ color: "rgba(251,191,36,0.6)" }}>
                    Click to review and approve or reject
                  </p>
                </div>
                <FiCheckCircle size={16} color="rgba(251,191,36,0.5)" />
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}