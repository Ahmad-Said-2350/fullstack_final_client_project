"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { FiPlus, FiGlobe, FiMapPin, FiUsers } from "react-icons/fi";
import RegisterCompanyModal from "@/components/dashboard/RegisterCompanyModal";

const statusStyle = (status) => {
  switch (status) {
    case "approved":
      return { background: "rgba(34,197,94,0.15)", color: "#4ade80", label: "Approved" };
    case "rejected":
      return { background: "rgba(239,68,68,0.15)", color: "#f87171", label: "Rejected" };
    default:
      return { background: "rgba(234,179,8,0.15)", color: "#facc15", label: "Pending" };
  }
};

const MyCompanyPage = () => {
  const { data: session } = authClient.useSession();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const email = session?.user?.email;

  const fetchCompanies = async () => {
    if (!email) {
      setCompanies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/companies/my-company?email=${encodeURIComponent(email)}`
      );

      if (!res.ok) {
        setCompanies([]);
        return;
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      setCompanies(data ? [data] : []);
    } catch (err) {
      console.error(err);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCompanies();
  }, [email]);

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">My Companies</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Manage your registered companies and their verification status.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingCompany(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-[10px] rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{ background: "#ffffff", color: "#0a0a0a" }}
          >
            <FiPlus size={15} />
            Register a company
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}
            />
          </div>
        )}

        {!loading && companies.length === 0 && (
          <div
            className="flex flex-col items-center justify-center text-center py-20 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-white font-semibold mb-2">No company registered yet</p>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>
              Register your company to start posting jobs on HireLoop.
            </p>
            <button
              onClick={() => {
                setEditingCompany(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-[10px] rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", color: "#ffffff" }}
            >
              <FiPlus size={15} />
              Register Company
            </button>
          </div>
        )}

        {!loading && companies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => {
              const badge = statusStyle(company.status);
              return (
                <div
                  key={company._id}
                  onClick={() => {
                    setEditingCompany(company);
                    setIsModalOpen(true);
                  }}
                  className="flex flex-col p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:border-white/15"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-sm">{company.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{company.name}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{company.industry}</p>
                      </div>
                    </div>

                    <span
                      className="text-[10px] font-bold tracking-wide px-2 py-1 rounded-full uppercase"
                      style={{ background: badge.background, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {company.description}
                  </p>

                  <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "12px" }} />

                  <div className="flex items-center gap-4 mb-3 flex-wrap">
                    <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <FiMapPin size={12} />
                      {company.location}
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <FiUsers size={12} />
                      {company.employeeCount}
                    </div>
                  </div>

                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs transition-colors duration-200 hover:text-indigo-300"
                      style={{ color: "#818cf8" }}
                    >
                      <FiGlobe size={12} />
                      Visit Website
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <RegisterCompanyModal
          company={editingCompany}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchCompanies();
          }}
        />
      )}
    </div>
  );
};

export default MyCompanyPage;