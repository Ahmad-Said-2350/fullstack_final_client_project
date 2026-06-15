"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
  FiLoader, FiSearch, FiBookmark, FiMapPin,
  FiClock, FiDollarSign, FiTrash2, FiArrowRight
} from "react-icons/fi";

const formatSalary = (salary) => {
  if (!salary) return null;
  return salary;
};

const jobTypeColors = {
  "Full-time":  { bg: "rgba(34,197,94,0.08)",  color: "#4ade80",  border: "rgba(34,197,94,0.15)"  },
  "Part-time":  { bg: "rgba(251,191,36,0.08)", color: "#fbbf24",  border: "rgba(251,191,36,0.15)" },
  "Remote":     { bg: "rgba(99,102,241,0.1)",  color: "#818cf8",  border: "rgba(99,102,241,0.2)"  },
  "Contract":   { bg: "rgba(239,68,68,0.08)",  color: "#f87171",  border: "rgba(239,68,68,0.15)"  },
  "Internship": { bg: "rgba(168,85,247,0.1)",  color: "#c084fc",  border: "rgba(168,85,247,0.2)"  },
};

export default function SavedJobsPage() {
  const { data: session } = authClient.useSession();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!session?.user?.email) return;
    // eslint-disable-next-line react-hooks/immutability
    fetchSavedJobs();
  }, [session]);

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/saved-jobs?email=${session.user.email}`
      );
      const data = await res.json();
      setSavedJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId) => {
    setRemovingId(jobId);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/saved-jobs/${jobId}?email=${session.user.email}`,
        { method: "DELETE" }
      );
      setSavedJobs((prev) => prev.filter((j) => j.jobId !== jobId));
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  const filtered = savedJobs.filter(
    (j) =>
      j.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 md:px-8 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-bold text-white">Saved Jobs</h1>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              {savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <Link
            href="/jobs"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 self-start"
            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
          >
            Browse Jobs <FiArrowRight size={14} />
          </Link>
        </div>

        {/* Search */}
        {savedJobs.length > 0 && (
          <div className="relative mb-6">
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
              placeholder="Search saved jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-[10px] rounded-xl text-sm text-white outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <FiLoader size={22} color="#6366f1" className="animate-spin" />
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <FiBookmark size={22} color="#818cf8" />
            </div>
            <h3 className="text-white font-semibold mb-2">No saved jobs yet</h3>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>
              Browse jobs and save the ones you're interested in.
            </p>
            <Link
              href="/jobs"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
            >
              Browse Jobs <FiArrowRight size={14} />
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white font-medium">No results for "{search}"</p>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Try a different keyword.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((job) => {
              const typeStyle = jobTypeColors[job.jobType] || jobTypeColors["Full-time"];
              const isRemoving = removingId === job.jobId;

              return (
                <div
                  key={job._id}
                  className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 group"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    transition: "border-color 0.2s",
                  }}
                >
                  {/* Logo */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {job.companyName?.charAt(0) || "?"}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm">{job.jobTitle}</h3>
                      {job.jobType && (
                        <span
                          className="text-[11px] font-medium px-2 py-[2px] rounded-full"
                          style={{ background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}` }}
                        >
                          {job.jobType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {job.companyName}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {job.location && (
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                          <FiMapPin size={11} /> {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                          <FiDollarSign size={11} /> {job.salary}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/jobs/${job.jobId}`}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-white transition-all hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
                    >
                      View Job
                    </Link>
                    <button
                      onClick={() => handleRemove(job.jobId)}
                      disabled={isRemoving}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:bg-red-500/10"
                      style={{
                        border: "1px solid rgba(239,68,68,0.15)",
                        color: "rgba(248,113,113,0.7)",
                      }}
                    >
                      {isRemoving ? (
                        <FiLoader size={13} className="animate-spin" />
                      ) : (
                        <FiTrash2 size={13} />
                      )}
                      <span className="hidden sm:inline">Remove</span>
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
}