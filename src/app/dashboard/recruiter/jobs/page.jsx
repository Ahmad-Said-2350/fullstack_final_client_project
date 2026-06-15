"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2,
  FiToggleLeft, FiToggleRight, FiLoader,
  FiBriefcase, FiMapPin, FiClock, FiUsers
} from "react-icons/fi";

const statusColors = {
  active: { bg: "rgba(34,197,94,0.1)", color: "#4ade80", border: "rgba(34,197,94,0.2)", label: "Active" },
  closed: { bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "rgba(239,68,68,0.2)", label: "Closed" },
};

const ManageJobsPage = () => {
  const { data: session } = authClient.useSession();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchJobs = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/recruiter?email=${session.user.email}`
      );
      const text = await res.text();
      if (!text) { setJobs([]); return; }
      const data = JSON.parse(text);
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (session?.user?.email) fetchJobs();
  }, [session]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    setDeletingId(id);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, { method: "DELETE" });
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "active" ? "closed" : "active";
    setTogglingId(job._id);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${job._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setJobs((prev) =>
        prev.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = jobs.filter((j) =>
    j.title?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Empty State ──
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
      >
        <FiBriefcase size={24} color="#818cf8" />
      </div>
      <h3 className="text-white font-semibold mb-2">No jobs posted yet</h3>
      <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>
        Post your first job listing to start receiving applications.
      </p>
      <Link
        href="/dashboard/recruiter/jobs/new"
        className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
      >
        <FiPlus size={15} /> Post a Job
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen px-4 md:px-8 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-bold text-white">Manage Jobs</h1>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
            </p>
          </div>
          <Link
            href="/dashboard/recruiter/jobs/new"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 self-start sm:self-auto"
            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
          >
            <FiPlus size={15} /> Post New Job
          </Link>
        </div>

        {/* Search */}
        {jobs.length > 0 && (
          <div className="relative mb-6">
            <FiSearch
              size={14}
              color="rgba(255,255,255,0.3)"
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-[10px] rounded-xl text-sm text-white outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader size={22} color="#6366f1" className="animate-spin" />
          </div>
        ) : filtered.length === 0 && search ? (
          <div className="text-center py-16">
            <p className="text-white font-medium mb-1">No results for "{search}"</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Try a different keyword.</p>
          </div>
        ) : jobs.length === 0 ? (
          // eslint-disable-next-line react-hooks/static-components
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((job) => {
              const s = statusColors[job.status] || statusColors.active;
              const isDeleting = deletingId === job._id;
              const isToggling = togglingId === job._id;

              return (
                <div
                  key={job._id}
                  className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Left — Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-white font-semibold text-sm truncate">{job.title}</h3>
                      <span
                        className="text-[11px] font-medium px-2 py-[2px] rounded-full"
                        style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                      >
                        {s.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {job.category && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                          <FiBriefcase size={11} /> {job.category}
                        </span>
                      )}
                      {job.location && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                          <FiMapPin size={11} /> {job.location}
                        </span>
                      )}
                      {job.jobType && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                          <FiClock size={11} /> {job.jobType}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <FiUsers size={11} /> {job.applicantsCount || 0} applicants
                      </span>
                    </div>
                  </div>

                  {/* Right — Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">

                    {/* Toggle Status */}
                    <button
                      onClick={() => handleToggleStatus(job)}
                      disabled={isToggling}
                      title={job.status === "active" ? "Close job" : "Reopen job"}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/10"
                      style={{
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {isToggling ? (
                        <FiLoader size={13} className="animate-spin" />
                      ) : job.status === "active" ? (
                        <FiToggleRight size={15} color="#4ade80" />
                      ) : (
                        <FiToggleLeft size={15} color="#f87171" />
                      )}
                      <span className="hidden sm:inline">
                        {job.status === "active" ? "Close" : "Reopen"}
                      </span>
                    </button>

                    {/* View Applicants */}
                    <Link
                      href={`/dashboard/recruiter/jobs/${job._id}/applicants`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/10"
                      style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                    >
                      <FiUsers size={13} />
                      <span className="hidden sm:inline">Applicants</span>
                    </Link>

                    {/* Edit */}
                    <Link
                      href={`/dashboard/recruiter/jobs/${job._id}/edit`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/10"
                      style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                    >
                      <FiEdit2 size={13} />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(job._id)}
                      disabled={isDeleting}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:bg-red-500/10"
                      style={{ border: "1px solid rgba(239,68,68,0.15)", color: "rgba(248,113,113,0.7)" }}
                    >
                      {isDeleting
                        ? <FiLoader size={13} className="animate-spin" />
                        : <FiTrash2 size={13} />
                      }
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageJobsPage;