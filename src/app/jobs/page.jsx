"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  FiSearch, FiMapPin, FiDollarSign, FiClock,
  FiBriefcase, FiLoader, FiX, FiBookmark
} from "react-icons/fi";

const categories = ["Engineering", "Design", "Marketing", "Sales", "Finance", "HR", "Product", "Other"];
const jobTypes = ["Full-time", "Part-time", "Remote", "Contract", "Internship"];

const BrowseJobsPage = () => {
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");

  // ✅ Saved job IDs track করো
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [savingId, setSavingId] = useState(null);

  // Jobs fetch
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (jobType) params.append("jobType", jobType);
      if (location) params.append("location", location);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs?${params}`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ User এর saved jobs load করো
  const fetchSavedJobs = async () => {
    if (!email) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-jobs?email=${email}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSavedJobIds(new Set(data.map((j) => j.jobId)));
      }
    } catch {}
  };

  useEffect(() => {
    const timer = setTimeout(fetchJobs, 300);
    return () => clearTimeout(timer);
  }, [search, category, jobType, location]);

  useEffect(() => {
    fetchSavedJobs();
  }, [email]);

  // ✅ Save / Unsave toggle
  const handleSave = async (e, job) => {
    e.preventDefault(); // Link এর navigate বন্ধ করো
    e.stopPropagation();

    if (!email) {
      alert("Please sign in to save jobs.");
      return;
    }

    const jobId = job._id;
    const isSaved = savedJobIds.has(jobId);
    setSavingId(jobId);

    try {
      if (isSaved) {
        // Unsave
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-jobs/${jobId}?email=${email}`, {
          method: "DELETE",
        });
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        // Save
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-jobs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seekerEmail: email,
            jobId: job._id,
            jobTitle: job.title,
            companyName: job.companyName,
            companyLogo: job.companyLogo || null,
            location: job.location || null,
            jobType: job.jobType || null,
            salary: job.salaryMin ? `${job.currency || "USD"} ${job.salaryMin}–${job.salaryMax}` : null,
          }),
        });
        setSavedJobIds((prev) => new Set([...prev, jobId]));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const clearFilters = () => {
    setSearch(""); setCategory(""); setJobType(""); setLocation("");
  };

  const hasActiveFilters = search || category || jobType || location;

  const formatSalary = (job) => {
    if (!job.salaryMin && !job.salaryMax) return null;
    return `${job.currency || "USD"} ${job.salaryMin || 0}–${job.salaryMax || 0}`;
  };

  const selectStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "rgba(255,255,255,0.7)",
    padding: "8px 12px",
    fontSize: "13px",
    outline: "none",
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-12" style={{ background: "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-3">Browse Jobs</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Find your next opportunity from thousands of curated job listings.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6 relative">
          <FiSearch size={15} color="rgba(255,255,255,0.3)"
            style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="Search jobs by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
            <option value="" style={{ background: "#1a1a1a" }}>All Categories</option>
            {categories.map((c) => <option key={c} value={c} style={{ background: "#1a1a1a" }}>{c}</option>)}
          </select>

          <select value={jobType} onChange={(e) => setJobType(e.target.value)} style={selectStyle}>
            <option value="" style={{ background: "#1a1a1a" }}>All Job Types</option>
            {jobTypes.map((t) => <option key={t} value={t} style={{ background: "#1a1a1a" }}>{t}</option>)}
          </select>

          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ ...selectStyle, width: "160px" }}
          />

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-white/10"
              style={{ border: "1px solid rgba(239,68,68,0.2)", color: "rgba(248,113,113,0.8)" }}
            >
              <FiX size={13} /> Clear
            </button>
          )}
        </div>

        {/* Result count */}
        {!loading && jobs.length > 0 && (
          <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader size={22} color="#6366f1" className="animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <FiBriefcase size={24} color="#818cf8" />
            </div>
            <h3 className="text-white font-semibold mb-2">No jobs found</h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => {
              const isSaved = savedJobIds.has(job._id);
              const isSaving = savingId === job._id;

              return (
                <div
                  key={job._id}
                  className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl transition-all duration-200 hover:border-white/15"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {/* ✅ Save Button — উপরে ডানে */}
                  <button
                    onClick={(e) => handleSave(e, job)}
                    disabled={isSaving}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: isSaved ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)",
                      border: isSaved ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                    title={isSaved ? "Remove from saved" : "Save job"}
                  >
                    {isSaving ? (
                      <FiLoader size={13} color="#818cf8" className="animate-spin" />
                    ) : (
                      <FiBookmark
                        size={13}
                        color={isSaved ? "#818cf8" : "rgba(255,255,255,0.4)"}
                        fill={isSaved ? "#818cf8" : "none"}
                      />
                    )}
                  </button>

                  {/* Logo */}
                  <Link href={`/jobs/${job._id}`} className="flex items-center gap-4 flex-1 min-w-0 pr-10">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-lg">{job.companyName?.charAt(0) || "?"}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm mb-1">{job.title}</h3>
                      <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {job.companyName}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
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
                        {formatSalary(job) && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                            <FiDollarSign size={11} /> {formatSalary(job)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category badge */}
                    {job.category && (
                      <span
                        className="text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 hidden sm:block"
                        style={{
                          background: "rgba(99,102,241,0.1)",
                          border: "1px solid rgba(99,102,241,0.2)",
                          color: "#a5b4fc",
                        }}
                      >
                        {job.category}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default BrowseJobsPage;