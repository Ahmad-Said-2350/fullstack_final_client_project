"use client";

import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  MdOutlineArticle,
  MdOutlinePeople,
  MdOutlineBolt,
  MdOutlineVisibility,
  MdAdd,
} from "react-icons/md";
import { FiBell, FiSearch } from "react-icons/fi";

// ─── Hardcoded data (backend ready হলে replace করবে) ───
const stats = [
  { icon: MdOutlineArticle, label: "Total Job Posts", value: "48" },
  { icon: MdOutlinePeople, label: "Total Applicants", value: "1,284" },
  { icon: MdOutlineBolt, label: "Active Jobs", value: "18" },
  { icon: MdOutlineVisibility, label: "Jobs Closed", value: "32" },
];

const applications = [
  { name: "Julianne Moore", role: "Senior Product Designer", date: "Oct 24, 2023", exp: "6 years", status: "Interviewing" },
  { name: "Robert Downey", role: "Backend Engineer", date: "Oct 23, 2023", exp: "4 years", status: "New" },
  { name: "Emma Stone", role: "Marketing Lead", date: "Oct 22, 2023", exp: "8 years", status: "Reviewing" },
  { name: "Chris Pratt", role: "Product Manager", date: "Oct 21, 2023", exp: "5 years", status: "Rejected" },
];

const companies = [
  { name: "Google Inc.", industry: "Technology", location: "Mountain View", jobs: 24, icon: "G" },
  { name: "Meta Platforms", industry: "Social Media", location: "Menlo Park", jobs: 18, icon: "M" },
  { name: "Stripe", industry: "Fintech", location: "San Francisco", jobs: 12, icon: "S" },
  { name: "Tesla", industry: "Automotive", location: "Austin", jobs: 31, icon: "T" },
];

const statusStyle = (status) => {
  switch (status) {
    case "Interviewing": return { background: "rgba(34,197,94,0.15)", color: "#4ade80" };
    case "Reviewing": return { background: "rgba(234,179,8,0.15)", color: "#facc15" };
    case "Rejected": return { background: "rgba(239,68,68,0.15)", color: "#f87171" };
    case "New": return { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" };
    default: return { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" };
  }
};

// ─── Main Component ───
const RecruiterHome = () => {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name || "Recruiter";

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#0a0a0a" }}>

      {/* ── Top Header ── */}
      <div
        className="w-full flex items-center justify-between px-6 py-3 sticky top-0 z-10"
        style={{
          background: "#0f0f0f",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Search */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl flex-1 max-w-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <FiSearch size={14} color="rgba(255,255,255,0.3)" />
          <input
            type="text"
            placeholder="Search applications, jobs, or talent..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-white/25 text-white"
          />
        </div>

        {/* Right — Bell + User */}
        <div className="flex items-center gap-4 ml-4">
          <button
            className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <FiBell size={16} color="rgba(255,255,255,0.5)" />
            <span
              className="absolute top-1 right-1 w-[6px] h-[6px] rounded-full"
              style={{ background: "#6366f1" }}
            />
          </button>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-white leading-tight">{userName}</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>Recruiter</p>
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

      {/* ── Main Content ── */}
      <div className="flex-1 px-6 py-8 flex flex-col gap-8">

        {/* Welcome */}
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {userName}
        </h1>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col gap-6 p-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Icon size={18} color="rgba(255,255,255,0.5)" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom Row — Applications + Companies ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

          {/* Recent Applications */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-sm font-semibold text-white">Recent Applications</h2>
              <Link href="/dashboard/recruiter/applications" className="text-xs" style={{ color: "#818cf8" }}>
                View all
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["Candidate Name", "Role", "Date Applied", "Experience", "Status"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                            style={{ background: "rgba(99,102,241,0.25)" }}
                          >
                            {app.name.charAt(0)}
                          </div>
                          <span className="text-sm text-white">{app.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{app.role}</td>
                      <td className="px-5 py-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{app.date}</td>
                      <td className="px-5 py-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{app.exp}</td>
                      <td className="px-5 py-4">
                        <span
                          className="text-xs font-medium px-3 py-1 rounded-full"
                          style={statusStyle(app.status)}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* My Top Companies */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">My Top Companies</h2>
              <Link href="/dashboard/recruiter/company" className="text-xs" style={{ color: "#818cf8" }}>
                View all
              </Link>
            </div>

            {/* Company List */}
            <div className="flex flex-col gap-3">
              {companies.map((company, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3"
                  style={{ borderBottom: i < companies.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.2)" }}
                    >
                      {company.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{company.name}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {company.industry} • {company.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{company.jobs}</p>
                    <p className="text-[10px] tracking-wide" style={{ color: "rgba(255,255,255,0.3)" }}>ACTIVE JOBS</p>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <Link
              href="/dashboard/recruiter/company"
              className="w-full py-3 rounded-xl text-sm font-medium text-center transition-all duration-200 hover:bg-white/10 mt-1"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              View All Companies
            </Link>
          </div>

        </div>
      </div>

      {/* Floating + Button */}
      <Link
        href="/dashboard/recruiter/jobs/new"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:opacity-90 hover:scale-105"
        style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
      >
        <MdAdd size={22} color="#ffffff" />
      </Link>

    </div>
  );
};

export default RecruiterHome;