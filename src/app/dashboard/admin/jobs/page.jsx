"use client";

import { useState, useEffect } from "react";
import {
  FiLoader,
  FiSearch,
  FiTrash2,
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiChevronDown,
} from "react-icons/fi";

const categories = [
  "All", "Engineering", "Design", "Marketing", "Sales",
  "Finance", "Healthcare", "Education", "Data Science", "Other",
];

const statusColors = {
  active: { bg: "rgba(34,197,94,0.1)", color: "#4ade80", border: "rgba(34,197,94,0.2)" },
  closed: { bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "rgba(239,68,68,0.2)" },
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "All") params.append("category", categoryFilter);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/jobs?${params}`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs();
  }, [statusFilter, categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeletingId(deleteId);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/jobs/${deleteId}`, {
        method: "DELETE",
      });
      setJobs((prev) => prev.filter((j) => j._id !== deleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
      setDeleteOpen(false);
      setDeleteId(null);
      setDeleteName("");
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">Manage Jobs</h1>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Review and remove job listings from the platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <FiSearch
                size={13}
                color="rgba(255,255,255,0.3)"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                placeholder="Search job title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-white outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", color: "#fff" }}
            >
              Search
            </button>
          </form>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none text-sm pl-3 pr-8 py-2.5 rounded-xl outline-none cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <option value="all" style={{ background: "#1a1a1a" }}>All Status</option>
              <option value="active" style={{ background: "#1a1a1a" }}>Active</option>
              <option value="closed" style={{ background: "#1a1a1a" }}>Closed</option>
            </select>
            <FiChevronDown
              size={12}
              color="rgba(255,255,255,0.3)"
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none text-sm pl-3 pr-8 py-2.5 rounded-xl outline-none cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c} style={{ background: "#1a1a1a" }}>{c}</option>
              ))}
            </select>
            <FiChevronDown
              size={12}
              color="rgba(255,255,255,0.3)"
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            />
          </div>
        </div>

        <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
          {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader size={22} color="#6366f1" className="animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white font-medium mb-1">No jobs found</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Try changing the filters.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => {
              const s = statusColors[job.status] || statusColors.active;
              const isDeleting = deletingId === job._id;

              return (
                <div
                  key={job._id}
                  className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 text-sm font-bold text-white"
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.2)",
                    }}
                  >
                    {job.companyLogo
                      ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                      : job.companyName?.[0]?.toUpperCase() || "?"
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-white font-semibold text-sm truncate">{job.title}</p>
                      <span
                        className="text-[11px] font-medium px-2 py-[2px] rounded-full capitalize"
                        style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs flex items-center gap-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <FiBriefcase size={11} /> {job.companyName}
                      </span>
                      {job.location && (
                        <span className="text-xs flex items-center gap-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                          <FiMapPin size={11} /> {job.location}
                        </span>
                      )}
                      {job.jobType && (
                        <span className="text-xs flex items-center gap-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                          <FiClock size={11} /> {job.jobType}
                        </span>
                      )}
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                        Posted {formatDate(job.createdAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setDeleteId(job._id);
                      setDeleteName(job.title || "this job");
                      setDeleteOpen(true);
                    }}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:bg-red-500/15 flex-shrink-0"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "#f87171",
                      opacity: isDeleting ? 0.6 : 1,
                    }}
                  >
                    {isDeleting
                      ? <FiLoader size={13} className="animate-spin" />
                      : <FiTrash2 size={13} />
                    }
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              setDeleteOpen(false);
              setDeleteId(null);
              setDeleteName("");
            }}
          />
          <div
            className="relative w-full max-w-md rounded-2xl p-6"
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <h3 className="text-lg font-semibold text-white">Delete job?</h3>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Are you sure you want to remove <span className="text-white">{deleteName}</span>? This cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteOpen(false);
                  setDeleteId(null);
                  setDeleteName("");
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}