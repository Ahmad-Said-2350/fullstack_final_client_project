"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiMapPin, FiUsers, FiBriefcase, FiGlobe,
  FiArrowLeft, FiLoader, FiClock, FiDollarSign,
} from "react-icons/fi";

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

const formatSalary = (job) => {
  if (!job.salaryMin && !job.salaryMax) return null;
  return `${job.currency || "USD"} ${job.salaryMin || 0}–${job.salaryMax || 0}`;
};

export default function CompanyDetailsPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [companyRes, jobsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/company/${id}`),
        ]);

        const companyData = await companyRes.json();
        const jobsData = await jobsRes.json();

        setCompany(companyData);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0a0a0a" }}>
        <FiLoader size={24} color="#6366f1" className="animate-spin" />
      </div>
    );
  }

  if (!company || company.message === "Company not found") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3" style={{ background: "#0a0a0a" }}>
        <p className="text-white font-semibold">Company not found</p>
        <Link href="/companies" className="text-sm" style={{ color: "#818cf8" }}>
          ← Back to Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-10" style={{ background: "#0a0a0a" }}>
      <div className="max-w-4xl mx-auto flex flex-col gap-5">

        {/* Back */}
        <Link
          href="/companies"
          className="flex items-center gap-2 text-sm w-fit transition-colors hover:text-white"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <FiArrowLeft size={14} /> Back to Companies
        </Link>

        {/* ── Company Header Card ── */}
        <div
          className="p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
            {/* Logo */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {company.name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">{company.name}</h1>
              <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                {company.industry}
              </p>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-4">
                {company.location && (
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    <FiMapPin size={12} /> {company.location}
                  </span>
                )}
                {company.employeeCount && (
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    <FiUsers size={12} /> {company.employeeCount} employees
                  </span>
                )}
                {company.website && (
                  <a
                    href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs transition-colors hover:text-indigo-300"
                    style={{ color: "#818cf8" }}
                  >
                    <FiGlobe size={12} /> {company.website}
                  </a>
                )}
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                  <FiBriefcase size={12} /> {jobs.length} open job{jobs.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {company.description && (
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                {company.description}
              </p>
            </div>
          )}
        </div>

        {/* ── Open Jobs ── */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">
            Open Positions ({jobs.length})
          </h2>

          {jobs.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 rounded-2xl text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <FiBriefcase size={28} color="rgba(255,255,255,0.15)" />
              <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                No open positions right now.
              </p>
              <Link href="/jobs" className="text-xs mt-2" style={{ color: "#818cf8" }}>
                Browse all jobs →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {jobs.map((job) => (
                <Link
                  key={job._id}
                  href={`/jobs/${job._id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl transition-all hover:border-white/15"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {/* Left info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white mb-1">{job.title}</p>
                    <div className="flex flex-wrap gap-3">
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

                  {/* Right — badge + date */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {job.category && (
                      <span
                        className="text-xs font-medium px-3 py-1 rounded-full"
                        style={{
                          background: "rgba(99,102,241,0.1)",
                          border: "1px solid rgba(99,102,241,0.2)",
                          color: "#a5b4fc",
                        }}
                      >
                        {job.category}
                      </span>
                    )}
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {formatDate(job.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}