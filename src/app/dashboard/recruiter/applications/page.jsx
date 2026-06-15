"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  FiLoader,
  FiUsers,
  FiSearch,
  FiChevronDown,
  FiMail,
  FiCalendar,
  FiBriefcase,
} from "react-icons/fi";

const statusOptions = ["All", "Applied", "Under Review", "Shortlisted", "Rejected", "Offered"];

const statusStyle = (status) => {
  switch (status) {
    case "Shortlisted":
      return { background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" };
    case "Under Review":
      return { background: "rgba(234,179,8,0.12)", color: "#facc15", border: "1px solid rgba(234,179,8,0.2)" };
    case "Rejected":
      return { background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" };
    case "Offered":
      return { background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" };
    default:
      return { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.1)" };
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

export default function RecruiterApplicationsPage() {
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;

  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all applications for this recruiter's jobs
  useEffect(() => {
    const fetchApplications = async () => {
      if (!email) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/recruiter/recent-applications?email=${email}&limit=100`
        );
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [email]);

  // Filter logic
  useEffect(() => {
    let result = [...applications];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.applicantName?.toLowerCase().includes(q) ||
          a.jobTitle?.toLowerCase().includes(q) ||
          a.applicantEmail?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((a) => (a.status || "Applied") === statusFilter);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFiltered(result);
  }, [search, statusFilter, applications]);

  // Update application status
  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0a0a0a" }}>
        <FiLoader size={22} color="#6366f1" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-10" style={{ background: "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">All Applications</h1>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              {applications.length} total application{applications.length !== 1 ? "s" : ""} across all your jobs
            </p>
          </div>

          {/* Stats chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {["Shortlisted", "Under Review", "Rejected"].map((s) => {
              const count = applications.filter((a) => (a.status || "Applied") === s).length;
              return (
                <span
                  key={s}
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={statusStyle(s)}
                >
                  {count} {s}
                </span>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div
            className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <FiSearch size={14} color="rgba(255,255,255,0.3)" />
            <input
              type="text"
              placeholder="Search by name, job title or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm text-white placeholder:text-white/25 w-full"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none text-sm pl-4 pr-9 py-2.5 rounded-xl outline-none cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
                minWidth: "150px",
              }}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s} style={{ background: "#1a1a1a" }}>
                  {s}
                </option>
              ))}
            </select>
            <FiChevronDown
              size={13}
              color="rgba(255,255,255,0.3)"
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            />
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <FiUsers size={32} color="rgba(255,255,255,0.15)" />
            <p className="text-sm mt-3 font-medium text-white">No applications found</p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              {applications.length === 0
                ? "No one has applied to your jobs yet."
                : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div
              className="hidden md:block rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Applicant", "Job Title", "Email", "Applied On", "Status", "Action"].map((h) => (
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
                  {filtered.map((app) => (
                    <tr
                      key={app._id}
                      className="transition-colors hover:bg-white/[0.02]"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      {/* Applicant */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: "rgba(99,102,241,0.25)" }}
                          >
                            {app.applicantName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="text-sm text-white font-medium">
                            {app.applicantName || "Unknown"}
                          </span>
                        </div>
                      </td>

                      {/* Job Title */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <FiBriefcase size={12} color="rgba(255,255,255,0.3)" />
                          <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                            {app.jobTitle || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <FiMail size={12} color="rgba(255,255,255,0.3)" />
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                            {app.applicantEmail || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar size={12} color="rgba(255,255,255,0.3)" />
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                            {formatDate(app.appliedAt)}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        <span
                          className="text-xs font-medium px-3 py-1 rounded-full"
                          style={statusStyle(app.status || "Applied")}
                        >
                          {app.status || "Applied"}
                        </span>
                      </td>

                      {/* Action dropdown */}
                      <td className="px-5 py-4">
                        <div className="relative">
                          <select
                            value={app.status || "Applied"}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            disabled={updatingId === app._id}
                            className="appearance-none text-xs pl-3 pr-7 py-1.5 rounded-lg outline-none cursor-pointer"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "rgba(255,255,255,0.6)",
                              opacity: updatingId === app._id ? 0.5 : 1,
                            }}
                          >
                            {statusOptions.filter((s) => s !== "All").map((s) => (
                              <option key={s} value={s} style={{ background: "#1a1a1a" }}>
                                {s}
                              </option>
                            ))}
                          </select>
                          {updatingId === app._id ? (
                            <FiLoader
                              size={11}
                              color="rgba(255,255,255,0.3)"
                              className="animate-spin"
                              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                            />
                          ) : (
                            <FiChevronDown
                              size={11}
                              color="rgba(255,255,255,0.3)"
                              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {filtered.map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-2xl flex flex-col gap-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: "rgba(99,102,241,0.25)" }}
                      >
                        {app.applicantName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{app.applicantName || "Unknown"}</p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {app.applicantEmail}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                      style={statusStyle(app.status || "Applied")}
                    >
                      {app.status || "Applied"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <span className="flex items-center gap-1">
                      <FiBriefcase size={11} /> {app.jobTitle}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar size={11} /> {formatDate(app.appliedAt)}
                    </span>
                  </div>

                  {/* Mobile status update */}
                  <div className="relative">
                    <select
                      value={app.status || "Applied"}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      disabled={updatingId === app._id}
                      className="w-full appearance-none text-xs pl-3 pr-7 py-2 rounded-lg outline-none cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {statusOptions.filter((s) => s !== "All").map((s) => (
                        <option key={s} value={s} style={{ background: "#1a1a1a" }}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown
                      size={11}
                      color="rgba(255,255,255,0.3)"
                      style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}