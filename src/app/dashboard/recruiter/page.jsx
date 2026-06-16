"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  MdOutlineArticle,
  MdOutlinePeople,
  MdOutlineBolt,
  MdOutlineVisibility,
  MdAdd,
} from "react-icons/md";
import { FiBell, FiSearch, FiLoader } from "react-icons/fi";

const statusStyle = (status) => {
  switch (status) {
    case "Shortlisted": return { background: "rgba(34,197,94,0.15)", color: "#4ade80" };
    case "Under Review": return { background: "rgba(234,179,8,0.15)", color: "#facc15" };
    case "Rejected":    return { background: "rgba(239,68,68,0.15)", color: "#f87171" };
    case "Offered":     return { background: "rgba(168,85,247,0.15)", color: "#c084fc" };
    default:            return { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" };
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

const RecruiterHome = () => {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name || "Recruiter";
  const email = session?.user?.email;

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    const fetchAll = async () => {
      try {
        const [statsRes, appsRes, companiesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/recruiter/stats?email=${email}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/recruiter/recent-applications?email=${email}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`),
        ]);

        const statsData = await statsRes.json();
        const appsData = await appsRes.json();
        const companiesData = await companiesRes.json();

        setStats(statsData);
        setApplications(Array.isArray(appsData) ? appsData.slice(0, 5) : []);
        setCompanies(Array.isArray(companiesData) ? companiesData.slice(0, 4) : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [email]);

  const statCards = [
    { icon: MdOutlineArticle,    label: "Total Job Posts",   value: stats?.totalJobPosts ?? "—" },
    { icon: MdOutlinePeople,     label: "Total Applicants",  value: stats?.totalApplicants ?? "—" },
    { icon: MdOutlineBolt,       label: "Active Jobs",       value: stats?.activeJobs ?? "—" },
    { icon: MdOutlineVisibility, label: "Jobs Closed",       value: stats?.jobsClosed ?? "—" },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#0a0a0a" }}>

      {/* ── Top Header ── */}
      <div
        className="w-full flex items-center justify-between px-6 py-3 sticky top-0 z-10"
        style={{ background: "#0f0f0f", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl flex-1 max-w-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <FiSearch size={14} color="rgba(255,255,255,0.3)" />
          <input
            type="text"
            placeholder="Search applications, jobs, or talent..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-white/25 text-white"
          />
        </div>

        <div className="flex items-center gap-4 ml-4">
          <button
            className="relative w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <FiBell size={16} color="rgba(255,255,255,0.5)" />
            <span className="absolute top-1 right-1 w-[6px] h-[6px] rounded-full" style={{ background: "#6366f1" }} />
          </button>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-white leading-tight">{userName}</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>Recruiter</p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 px-6 py-8 flex flex-col gap-8">

        <h1 className="text-2xl font-bold text-white">Welcome back, {userName}</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader size={22} color="#6366f1" className="animate-spin" />
          </div>
        ) : (
          <>
            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col gap-6 p-5 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <Icon size={18} color="rgba(255,255,255,0.5)" />
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Bottom Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

              {/* Recent Applications */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center justify-between px-5 py-4">
                  <h2 className="text-sm font-semibold text-white">Recent Applications</h2>
                  <Link href="/dashboard/recruiter/applications" className="text-xs" style={{ color: "#818cf8" }}>
                    View all
                  </Link>
                </div>

                {applications.length === 0 ? (
                  <div className="px-5 py-12 text-center">
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                      No applications yet.
                    </p>
                    <Link
                      href="/dashboard/recruiter/jobs/new"
                      className="text-xs mt-2 inline-block"
                      style={{ color: "#818cf8" }}
                    >
                      Post a job to get started →
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {["Candidate", "Job Title", "Applied On", "Status"].map((h) => (
                            <th key={h} className="text-left px-5 py-3 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app, i) => (
                          <tr
                            key={i}
                            className="hover:bg-white/[0.02] transition-colors"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                                  style={{ background: "rgba(99,102,241,0.25)" }}
                                >
                                  {app.applicantName?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <span className="text-sm text-white">{app.applicantName || "Unknown"}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                              {app.jobTitle || "—"}
                            </td>
                            <td className="px-5 py-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                              {formatDate(app.appliedAt)}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className="text-xs font-medium px-3 py-1 rounded-full"
                                style={statusStyle(app.status)}
                              >
                                {app.status || "Applied"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Top Companies */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-4"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">Top Companies</h2>
                  <Link href="/companies" className="text-xs" style={{ color: "#818cf8" }}>View all</Link>
                </div>

                {companies.length === 0 ? (
                  <p className="text-sm text-center py-6" style={{ color: "rgba(255,255,255,0.35)" }}>
                    No approved companies yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {companies.map((company, i) => (
                      <div
                        key={company._id}
                        className="flex items-center gap-3 py-3"
                        style={{ borderBottom: i < companies.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden text-sm font-bold text-white flex-shrink-0"
                          style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.2)" }}
                        >
                          {company.logo
                            ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                            : company.name?.charAt(0)?.toUpperCase()
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{company.name}</p>
                          <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {company.industry} • {company.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href="/companies"
                  className="w-full py-3 rounded-xl text-sm font-medium text-center transition-all hover:bg-white/10"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  View All Companies
                </Link>
              </div>

            </div>
          </>
        )}
      </div>

      {/* Floating + Button */}
      <Link
        href="/dashboard/recruiter/jobs/new"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:opacity-90 hover:scale-105"
        style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
      >
        <MdAdd size={22} color="#ffffff" />
      </Link>

    </div>
  );
};

export default RecruiterHome;