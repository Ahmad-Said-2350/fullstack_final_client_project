"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  FiSearch,
  FiBell,
  FiLoader,
  FiBriefcase,
  FiClock,
  FiStar,
  FiBookmark,
  FiArrowRight,
  FiMapPin,
  FiDollarSign,
} from "react-icons/fi";
import { MdOutlineWorkOutline } from "react-icons/md";

const statusStyle = (status) => {
  switch (status) {
    case "Shortlisted":
      return { bg: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" };
    case "Under Review":
      return { bg: "rgba(234,179,8,0.12)", color: "#facc15", border: "1px solid rgba(234,179,8,0.2)" };
    case "Rejected":
      return { bg: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" };
    case "Offered":
      return { bg: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" };
    default:
      return { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.1)" };
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const planStyle = (plan) => {
  if (plan === "premium") return { label: "PREMIUM", color: "#c084fc", bg: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" };
  if (plan === "pro") return { label: "PRO", color: "#60a5fa", bg: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" };
  return { label: "FREE", color: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" };
};

export default function SeekerDashboardHome() {
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;
  const userName = session?.user?.name || "Job Seeker";

  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      if (!email) return;
      try {
        const [statsRes, appsRes, jobsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/seeker/stats?email=${email}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/my-applications?email=${email}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`),
        ]);

        const statsData = await statsRes.json();
        const appsData = await appsRes.json();
        const jobsData = await jobsRes.json();

        setStats(statsData);
        setRecentApps(Array.isArray(appsData) ? appsData.slice(0, 5) : []);
        setRecentJobs(Array.isArray(jobsData) ? jobsData.slice(0, 4) : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [email]);

  const plan = planStyle(stats?.plan || "free");
  const applyUsed = stats?.appliedThisMonth || 0;
  const applyLimit = stats?.applyLimit || 3;
  const applyPercent = applyLimit === 999 ? 100 : Math.min((applyUsed / applyLimit) * 100, 100);

  const statCards = [
    { icon: FiBriefcase, label: "Total Applications", value: stats?.totalApplications ?? "—" },
    { icon: FiClock, label: "Active Applications", value: stats?.activeApplications ?? "—" },
    { icon: FiStar, label: "Shortlisted", value: stats?.shortlisted ?? "—" },
    { icon: FiBookmark, label: "Saved Jobs", value: stats?.savedJobs ?? "—" },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#0a0a0a" }}>
      <div
        className="w-full flex items-center justify-between px-6 py-3 sticky top-0 z-10"
        style={{ background: "#0f0f0f", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl flex-1 max-w-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <FiSearch size={14} color="rgba(255,255,255,0.3)" />
          <input
            type="text"
            placeholder="Search jobs, companies..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-white/25 text-white"
          />
        </div>

        <div className="flex items-center gap-4 ml-4">
          <button
            className="relative w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <FiBell size={16} color="rgba(255,255,255,0.5)" />
            <span className="absolute top-1 right-1 w-[6px] h-[6px] rounded-full" style={{ background: "#6366f1" }} />
          </button>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-white leading-tight">{userName}</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>Job Seeker</p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-6 py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Welcome back, {userName} 👋</h1>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              Here's your job search overview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: plan.bg, color: plan.color, border: plan.border }}
            >
              {plan.label} ACCOUNT
            </span>
            {stats?.plan === "free" && (
              <Link
                href="/dashboard/seeker/billing"
                className="text-xs font-medium px-3 py-1 rounded-full transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", color: "#fff" }}
              >
                Upgrade →
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader size={22} color="#6366f1" className="animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {statCards.map(({ icon: Icon, label, value }) => (
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
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <Icon size={16} color="rgba(255,255,255,0.45)" />
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="p-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">Monthly Application Limit</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {applyLimit === 999 ? "Unlimited applications" : `${applyUsed} of ${applyLimit} used this month`}
                  </p>
                </div>
                {stats?.plan === "free" && (
                  <Link
                    href="/dashboard/seeker/billing"
                    className="text-xs font-medium px-4 py-2 rounded-xl transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", color: "#fff" }}
                  >
                    Upgrade Plan
                  </Link>
                )}
              </div>

              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${applyPercent}%`,
                    background:
                      stats?.plan === "premium"
                        ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                        : stats?.plan === "pro"
                        ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                        : applyPercent >= 90
                        ? "linear-gradient(90deg, #ef4444, #dc2626)"
                        : applyPercent >= 70
                        ? "linear-gradient(90deg, #f59e0b, #d97706)"
                        : "linear-gradient(90deg, #6366f1, #7c3aed)",
                    boxShadow:
                      stats?.plan === "premium"
                        ? "0 0 14px rgba(245,158,11,0.25)"
                        : stats?.plan === "pro"
                        ? "0 0 14px rgba(99,102,241,0.25)"
                        : applyPercent >= 90
                        ? "0 0 14px rgba(239,68,68,0.25)"
                        : "0 0 14px rgba(99,102,241,0.18)",
                  }}
                />
              </div>

              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Free: 3/mo
                </span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>•</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Pro: 30/mo
                </span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>•</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Premium: Unlimited
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center justify-between px-5 py-4">
                  <h2 className="text-sm font-semibold text-white">Recent Applications</h2>
                  <Link
                    href="/dashboard/seeker/applications"
                    className="text-xs flex items-center gap-1"
                    style={{ color: "#818cf8" }}
                  >
                    View all <FiArrowRight size={11} />
                  </Link>
                </div>

                {recentApps.length === 0 ? (
                  <div className="px-5 py-12 flex flex-col items-center gap-2">
                    <MdOutlineWorkOutline size={28} color="rgba(255,255,255,0.15)" />
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                      No applications yet
                    </p>
                    <Link
                      href="/jobs"
                      className="text-xs mt-1"
                      style={{ color: "#818cf8" }}
                    >
                      Browse Jobs →
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {["Job Title", "Company", "Applied On", "Status"].map((h) => (
                            <th
                              key={h}
                              className="text-left px-5 py-3 text-xs font-medium"
                              style={{ color: "rgba(255,255,255,0.3)" }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentApps.map((app) => {
                          const s = statusStyle(app.status || "Applied");
                          return (
                            <tr
                              key={app._id}
                              className="transition-colors hover:bg-white/[0.02]"
                              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                            >
                              <td className="px-5 py-4 text-sm font-medium text-white">
                                {app.jobTitle || "—"}
                              </td>
                              <td className="px-5 py-4 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                                {app.companyName || "—"}
                              </td>
                              <td className="px-5 py-4 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                                {formatDate(app.appliedAt)}
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className="text-xs font-medium px-3 py-1 rounded-full"
                                  style={{ background: s.bg, color: s.color, border: s.border }}
                                >
                                  {app.status || "Applied"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div
                className="rounded-2xl p-5 flex flex-col gap-4"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">Latest Jobs</h2>
                  <Link
                    href="/jobs"
                    className="text-xs flex items-center gap-1"
                    style={{ color: "#818cf8" }}
                  >
                    View all <FiArrowRight size={11} />
                  </Link>
                </div>

                {recentJobs.length === 0 ? (
                  <p className="text-sm text-center py-6" style={{ color: "rgba(255,255,255,0.35)" }}>
                    No jobs available yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {recentJobs.map((job, i) => (
                      <Link
                        key={job._id}
                        href={`/jobs/${job._id}`}
                        className="flex flex-col gap-2 p-3 rounded-xl transition-all hover:bg-white/[0.03]"
                        style={{
                          borderBottom: i < recentJobs.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-white leading-snug">{job.title}</p>
                          {job.jobType && (
                            <span
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                              style={{
                                background: "rgba(99,102,241,0.1)",
                                border: "1px solid rgba(99,102,241,0.2)",
                                color: "#a5b4fc",
                              }}
                            >
                              {job.jobType}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                            <FiBriefcase size={10} /> {job.companyName}
                          </span>
                          {job.location && (
                            <span className="text-xs flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                              <FiMapPin size={10} /> {job.location}
                            </span>
                          )}
                          {(job.salaryMin || job.salaryMax) && (
                            <span className="text-xs flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                              <FiDollarSign size={10} /> {job.currency} {job.salaryMin}–{job.salaryMax}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                <Link
                  href="/jobs"
                  className="w-full py-2.5 rounded-xl text-xs font-medium text-center transition-all hover:bg-white/10 mt-1"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  Browse All Jobs
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}