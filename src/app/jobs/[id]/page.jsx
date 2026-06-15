"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiArrowLeft,
  FiLoader,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiGlobe,
  FiBriefcase,
} from "react-icons/fi";

const formatSalary = (job) => {
  if (!job?.salaryMin && !job?.salaryMax) return "Not disclosed";
  const currency = job.currency || "USD";
  return `${currency} ${job.salaryMin || 0} – ${job.salaryMax || 0}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const JobDetailsPage = () => {
  const { id } = useParams();
  const { data: session } = authClient.useSession();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success"|"error", message: "" }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Job details
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
        const data = await res.json();
        setJob(data);

        // 2. Similar jobs (same category)
        if (data?.category) {
          const simRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/jobs?category=${encodeURIComponent(data.category)}`
          );
          const simData = await simRes.json();
          setSimilarJobs(
            Array.isArray(simData)
              ? simData.filter((j) => j._id !== id).slice(0, 3)
              : []
          );
        }

        // 3. Check if seeker already applied
        if (session?.user?.email) {
          const appRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/applications/my-applications?email=${session.user.email}`
          );
          const apps = await appRes.json();
          if (Array.isArray(apps)) {
            setHasApplied(apps.some((a) => a.jobId === id));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, session]);

  const handleApply = async () => {
    if (!session?.user) {
      setStatus({ type: "error", message: "Please sign in to apply for this job." });
      return;
    }

    setApplying(true);
    setStatus(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: id,
          jobTitle: job.title,
          companyName: job.companyName,
          applicantEmail: session.user.email,
          applicantName: session.user.name,
        }),
      });

      if (!res.ok) throw new Error("Failed to apply");

      setHasApplied(true);
      setStatus({ type: "success", message: "Application submitted successfully!" });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Something went wrong." });
    } finally {
      setApplying(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "#0a0a0a" }}
      >
        <FiLoader size={24} color="#6366f1" className="animate-spin" />
      </div>
    );
  }

  // ── Not found ──
  if (!job) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen gap-3"
        style={{ background: "#0a0a0a" }}
      >
        <p className="text-white font-semibold">Job not found</p>
        <Link href="/jobs" className="text-sm" style={{ color: "#818cf8" }}>
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 md:px-8 py-10"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-5">

        {/* Back */}
        <Link
          href="/jobs"
          className="flex items-center gap-2 text-sm w-fit transition-colors hover:text-white"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <FiArrowLeft size={14} /> Back to Jobs
        </Link>

        {/* ── Header Card ── */}
        <div
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Company + Title row */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
            {/* Logo */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-xl">
                  {job.companyName?.charAt(0) || "?"}
                </span>
              )}
            </div>

            {/* Title + company name */}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white mb-1">{job.title}</h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                {job.companyName}
              </p>
            </div>

            {/* Job type badge */}
            {job.jobType && (
              <span
                className="text-xs font-medium px-3 py-1 rounded-full self-start flex-shrink-0"
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

          {/* Meta chips */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {job.location && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <FiMapPin size={12} /> {job.location}
              </span>
            )}
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <FiDollarSign size={12} /> {formatSalary(job)}
            </span>
            {job.deadline && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <FiCalendar size={12} /> Apply by {formatDate(job.deadline)}
              </span>
            )}
            {job.category && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <FiBriefcase size={12} /> {job.category}
              </span>
            )}
            {job.isRemote && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <FiGlobe size={12} /> Remote
              </span>
            )}
          </div>

          {/* Status message */}
          {status && (
            <div
              className="flex items-start gap-2 p-3 rounded-xl mb-4"
              style={{
                background:
                  status.type === "success"
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(239,68,68,0.08)",
                border:
                  status.type === "success"
                    ? "1px solid rgba(34,197,94,0.25)"
                    : "1px solid rgba(239,68,68,0.25)",
              }}
            >
              {status.type === "success" ? (
                <FiCheckCircle
                  size={15}
                  color="#4ade80"
                  style={{ flexShrink: 0, marginTop: "1px" }}
                />
              ) : (
                <FiAlertCircle
                  size={15}
                  color="#f87171"
                  style={{ flexShrink: 0, marginTop: "1px" }}
                />
              )}
              <p
                className="text-xs"
                style={{
                  color:
                    status.type === "success"
                      ? "rgba(74,222,128,0.9)"
                      : "rgba(248,113,113,0.9)",
                }}
              >
                {status.message}
              </p>
            </div>
          )}

          {/* Apply button */}
          <button
            onClick={handleApply}
            disabled={applying || hasApplied}
            className="px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2"
            style={{
              background: hasApplied
                ? "rgba(34,197,94,0.15)"
                : "linear-gradient(135deg, #6366f1, #7c3aed)",
              color: hasApplied ? "#4ade80" : "#ffffff",
              border: hasApplied ? "1px solid rgba(34,197,94,0.3)" : "none",
              cursor: hasApplied || applying ? "default" : "pointer",
              opacity: applying ? 0.7 : 1,
            }}
          >
            {applying ? (
              <>
                <FiLoader size={14} className="animate-spin" /> Applying...
              </>
            ) : hasApplied ? (
              <>
                <FiCheckCircle size={14} /> Applied
              </>
            ) : (
              "Apply Now"
            )}
          </button>
        </div>

        {/* ── Description Sections ── */}
        <div
          className="p-6 rounded-2xl flex flex-col gap-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {job.responsibilities && (
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">
                Responsibilities
              </h2>
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {job.responsibilities}
              </p>
            </div>
          )}

          {job.requirements && (
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">
                Requirements
              </h2>
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {job.requirements}
              </p>
            </div>
          )}

          {job.benefits && (
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">
                Benefits
              </h2>
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {job.benefits}
              </p>
            </div>
          )}
        </div>

        {/* ── Company Info Card ── */}
        {job.companyId && (
          <Link
            href={`/companies/${job.companyId}`}
            className="flex items-center gap-3 p-5 rounded-2xl transition-all duration-200 hover:border-white/15"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {job.companyName?.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{job.companyName}</p>
              <p
                className="text-xs flex items-center gap-1"
                style={{ color: "#818cf8" }}
              >
                <FiGlobe size={11} /> View company profile
              </p>
            </div>
          </Link>
        )}

        {/* ── Similar Jobs ── */}
        {similarJobs.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-white mb-3">
              Similar Jobs
            </h2>
            <div className="flex flex-col gap-3">
              {similarJobs.map((sj) => (
                <Link
                  key={sj._id}
                  href={`/jobs/${sj._id}`}
                  className="flex items-center justify-between p-4 rounded-2xl transition-all duration-200 hover:border-white/15"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{sj.title}</p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {sj.companyName} • {sj.location}
                    </p>
                  </div>
                  {sj.jobType && (
                    <span
                      className="text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ml-3"
                      style={{
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        color: "#a5b4fc",
                      }}
                    >
                      {sj.jobType}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default JobDetailsPage;