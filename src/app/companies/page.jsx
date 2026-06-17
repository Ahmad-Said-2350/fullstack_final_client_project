"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiMapPin, FiUsers, FiBriefcase, FiLoader } from "react-icons/fi";

const industryTabs = ["All", "Technology", "Fintech", "AI", "Developer Tools", "E-Commerce", "Healthcare", "Education", "Other"];

const BrowseCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeIndustry, setActiveIndustry] = useState("All");

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (activeIndustry !== "All") params.append("industry", activeIndustry);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies?${params.toString()}`);
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanies();
    }, 300); // debounce search

    return () => clearTimeout(timer);
  }, [search, activeIndustry]);

  return (
    <div className="min-h-screen px-4 md:px-8 py-12" style={{ background: "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-3">Browse Companies</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Discover top companies hiring on HireLoop right now.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6 relative">
          <FiSearch
            size={15}
            color="rgba(255,255,255,0.3)"
            style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>

        {/* Industry Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {industryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveIndustry(tab)}
              className="px-4 py-[6px] rounded-full text-xs font-medium transition-all duration-200"
              style={{
                background: activeIndustry === tab ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                border: activeIndustry === tab ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.08)",
                color: activeIndustry === tab ? "#a5b4fc" : "rgba(255,255,255,0.5)",
              }}
            >
             {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader size={22} color="#6366f1" className="animate-spin" />
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <FiBriefcase size={24} color="#818cf8" />
            </div>
            <h3 className="text-white font-semibold mb-2">No companies found</h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Try a different search or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <Link
                key={company._id}
                href={`/companies/${company._id}`}
                className="flex flex-col p-5 rounded-2xl transition-all duration-200 hover:border-white/15"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Logo + Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-lg">{company.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{company.name}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{company.industry}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {company.description}
                </p>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "12px" }} />

                {/* Location + Employees */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <FiMapPin size={12} />
                    {company.location}
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <FiUsers size={12} />
                    {company.employeeCount}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default BrowseCompaniesPage;