"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  FiLoader, FiSearch, FiBriefcase, FiCalendar,
  FiMapPin, FiClock, FiChevronDown
} from "react-icons/fi";

const statusConfig = {
  Applied: {
    bg: "rgba(99,102,241,0.12)",
    color: "#818cf8",
    border: "rgba(99,102,241,0.25)",
    dot: "#818cf8",
  },
  "Under Review": {
    bg: "rgba(251,191,36,0.1)",
    color: "#fbbf24",
    border: "rgba(251,191,36,0.2)",
    dot: "#fbbf24",
  },
  Shortlisted: {
    bg: "rgba(34,197,94,0.1)",
    color: "#4ade80",
    border: "rgba(34,197,94,0.2)",
    dot: "#4ade80",
  },
  Rejected: {
    bg: "rgba(239,68,68,0.1)",
    color: "#f87171",
    border: "rgba(239,68,68,0.2)",
    dot: "#f87171",
  },
  Offered: {
    bg: "rgba(168,85,247,0.12)",
    color: "#c084fc",
    border: "rgba(168,85,247,0.25)",
    dot: "#c084fc",
  },
};

const ALL_STATUSES = ["All", "Applied", "Under Review", "Shortlisted", "Rejected", "Offered"];

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function MyApplicationsPage() {
  const { data: session } = authClient.useSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (!session?.user?.email) return;
    fetchApplications();
  }, [session]);

  const fetchApplications = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/my-applications?email=${session.user.email}`
      );
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications.filter((app) => {
    const matchSearch =
      app.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      app.companyName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const stats = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    underReview: applications.filter((a) => a.status === "Under Review").length,
    offered: applications.filter((a) => a.status === "Offered").length,
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">My Applications</h1>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Track the status of all your job applications
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Applied", value: stats.total, color: "#818cf8" },
            { label: "Under Review", value: stats.underReview, color: "#fbbf24" },
            { label: "Shortlisted", value: stats.shortlisted, color: "#4ade80" },
            { label: "Offered", value: stats.offered, color: "#c084fc" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch
              size={13}
              style={{
                position: "absolute", left: "13px",
                top: "50%", transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.3)"
              }}
            />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-[10px] rounded-xl text-sm text-white outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pr-8 pl-4 py-[10px] rounded-xl text-sm outline-none cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s} style={{ background: "#1a1a2e" }}>{s}</option>
              ))}
            </select>
            <FiChevronDown
              size={13}
              style={{
                position: "absolute", right: "10px",
                top: "50%", transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.3)", pointerEvents: "none"
              }}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <FiLoader size={22} color="#6366f1" className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <FiBriefcase size={22} color="#818cf8" />
            </div>
            <h3 className="text-white font-semibold mb-2">
              {search || statusFilter !== "All" ? "No results found" : "No applications yet"}
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              {search || statusFilter !== "All"
                ? "Try adjusting your search or filter."
                : "Browse jobs and start applying!"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((app) => {
              const s = statusConfig[app.status] || statusConfig["Applied"];
              return (
                <div
                  key={app._id}
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                    {/* Company Logo */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {app.companyLogo ? (
                        <img src={app.companyLogo} alt={app.companyName} className="w-full h-full object-cover" />
                      ) : (
                        <FiBriefcase size={18} color="rgba(255,255,255,0.3)" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold text-sm">{app.jobTitle || "Untitled Job"}</h3>
                        <span
                          className="text-[11px] font-medium px-2 py-[2px] rounded-full flex items-center gap-1"
                          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: s.dot }}
                          />
                          {app.status}
                        </span>
                      </div>

                      <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
                        {app.companyName || "Unknown Company"}
                      </p>

                      <div className="flex flex-wrap gap-4">
                        {app.location && (
                          <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                            <FiMapPin size={11} /> {app.location}
                          </span>
                        )}
                        {app.jobType && (
                          <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                            <FiClock size={11} /> {app.jobType}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                          <FiCalendar size={11} /> Applied {formatDate(app.appliedAt)}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}