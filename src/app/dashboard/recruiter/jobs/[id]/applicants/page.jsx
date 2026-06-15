"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft, FiLoader, FiUsers, FiMail,
  FiCalendar, FiChevronDown
} from "react-icons/fi";

const statusOptions = ["Applied", "Under Review", "Shortlisted", "Rejected", "Offered"];

const statusColors = {
  "Applied":      { bg: "rgba(99,102,241,0.1)",  color: "#818cf8", border: "rgba(99,102,241,0.2)" },
  "Under Review": { bg: "rgba(251,191,36,0.1)",  color: "#fbbf24", border: "rgba(251,191,36,0.2)" },
  "Shortlisted":  { bg: "rgba(34,197,94,0.1)",   color: "#4ade80", border: "rgba(34,197,94,0.2)" },
  "Rejected":     { bg: "rgba(239,68,68,0.1)",   color: "#f87171", border: "rgba(239,68,68,0.2)" },
  "Offered":      { bg: "rgba(168,85,247,0.1)",  color: "#c084fc", border: "rgba(168,85,247,0.2)" },
};

const ApplicantsPage = () => {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/applicants`),
        ]);
        const jobData = await jobRes.json();
        const appData = await appRes.json();
        setJob(jobData);
        setApplicants(Array.isArray(appData) ? appData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleStatusChange = async (applicantId, newStatus) => {
    setUpdatingId(applicantId);
    setOpenDropdown(null);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${applicantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setApplicants((prev) =>
        prev.map((a) => (a._id === applicantId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0a0a0a" }}>
        <FiLoader size={24} color="#6366f1" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/dashboard/recruiter/jobs"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <FiArrowLeft size={15} color="rgba(255,255,255,0.6)" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">
              {job?.title || "Job"} — Applicants
            </h1>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          {statusOptions.slice(0, 4).map((s) => {
            const count = applicants.filter((a) => a.status === s).length;
            const style = statusColors[s];
            return (
              <div
                key={s}
                className="p-4 rounded-xl"
                style={{ background: style.bg, border: `1px solid ${style.border}` }}
              >
                <p className="text-xl font-bold" style={{ color: style.color }}>{count}</p>
                <p className="text-xs mt-1" style={{ color: style.color, opacity: 0.7 }}>{s}</p>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {applicants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <FiUsers size={24} color="#818cf8" />
            </div>
            <h3 className="text-white font-semibold mb-2">No applicants yet</h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Applications will appear here once candidates apply.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applicants.map((applicant) => {
              const s = statusColors[applicant.status] || statusColors["Applied"];
              const isUpdating = updatingId === applicant._id;
              const isOpen = openDropdown === applicant._id;

              return (
                <div
                  key={applicant._id}
                  className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", color: "#fff" }}
                  >
                    {applicant.applicantName?.[0]?.toUpperCase() || "?"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">
                      {applicant.applicantName || "Unknown"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      {applicant.applicantEmail && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                          <FiMail size={11} /> {applicant.applicantEmail}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <FiCalendar size={11} /> Applied {formatDate(applicant.appliedAt)}
                      </span>
                    </div>

                    {/* Cover Letter preview */}
                    {applicant.coverLetter && (
                      <p
                        className="text-xs mt-2 line-clamp-2"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {applicant.coverLetter}
                      </p>
                    )}
                  </div>

                  {/* Right — Status + Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">

                    {/* Resume link */}
                    {applicant.resumeUrl && (
                      <a
                        href={applicant.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/10"
                        style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                      >
                        Resume ↗
                      </a>
                    )}

                    {/* Status Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : applicant._id)}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                        style={{
                          background: s.bg,
                          border: `1px solid ${s.border}`,
                          color: s.color,
                        }}
                      >
                        {isUpdating
                          ? <FiLoader size={12} className="animate-spin" />
                          : <>
                              <span>{applicant.status || "Applied"}</span>
                              <FiChevronDown size={12} />
                            </>
                        }
                      </button>

                      {/* Dropdown Menu */}
                      {isOpen && (
                        <div
                          className="absolute right-0 top-full mt-1 z-20 rounded-xl overflow-hidden py-1"
                          style={{
                            background: "#1a1a1a",
                            border: "1px solid rgba(255,255,255,0.1)",
                            minWidth: "140px",
                          }}
                        >
                          {statusOptions.map((option) => {
                            const optStyle = statusColors[option];
                            return (
                              <button
                                key={option}
                                onClick={() => handleStatusChange(applicant._id, option)}
                                className="w-full text-left px-4 py-2 text-xs transition-colors hover:bg-white/5"
                                style={{
                                  color: applicant.status === option ? optStyle.color : "rgba(255,255,255,0.6)",
                                  fontWeight: applicant.status === option ? "600" : "400",
                                }}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Close dropdown on outside click */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
};

export default ApplicantsPage;