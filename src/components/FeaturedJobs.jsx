"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiMapPin, FiBriefcase, FiDollarSign, FiArrowRight, FiLoader } from "react-icons/fi";

const formatSalary = (job) => {
  if (!job?.salaryMin && !job?.salaryMax) return "Not disclosed";
  const currency = job.currency || "USD";
  return `${currency} ${job.salaryMin || 0}–${job.salaryMax || 0}`;
};

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/featured`);
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section className="w-full px-4 py-20 flex flex-col items-center">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span style={{ width: "6px", height: "6px", background: "#6366f1", borderRadius: "1px" }} />
          <span className="text-xs font-semibold tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>
            SMART JOB DISCOVERY
          </span>
          <span style={{ width: "6px", height: "6px", background: "#6366f1", borderRadius: "1px" }} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          The roles you never <br /> find by searching
        </h2>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <FiLoader size={22} color="#6366f1" className="animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          No jobs available right now. Check back soon!
        </p>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Link
              key={job._id}
              href={`/jobs/${job._id}`}
              className="flex flex-col p-5 rounded-2xl transition-all duration-200 hover:border-white/15"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Title + Company */}
              <h3 className="text-white font-bold text-base mb-2">{job.title}</h3>
              <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                {job.companyName}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {job.location && (
                  <span
                    className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)" }}
                  >
                    <FiMapPin size={11} /> {job.location}
                  </span>
                )}
                {job.jobType && (
                  <span
                    className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)" }}
                  >
                    <FiBriefcase size={11} /> {job.jobType}
                  </span>
                )}
              </div>

              {/* Salary */}
              <span
                className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full self-start mb-4"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)" }}
              >
                <FiDollarSign size={11} /> {formatSalary(job)}
              </span>

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "12px" }} />

              {/* Apply Now */}
              <span className="flex items-center gap-2 text-sm font-semibold text-white">
                Apply Now <FiArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* View all */}
      <Link
        href="/jobs"
        className="mt-10 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
      >
        View All Jobs
      </Link>

    </section>
  );
};

export default FeaturedJobs;