"use client";

import { FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import { FiLoader, FiCheck, FiX, FiSearch } from "react-icons/fi";

const statusColors = {
  pending: { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "rgba(251,191,36,0.2)" },
  approved: { bg: "rgba(34,197,94,0.1)", color: "#4ade80", border: "rgba(34,197,94,0.2)" },
  rejected: { bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "rgba(239,68,68,0.2)" },
};

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/companies?${params}`);
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchCompanies(); }, [filter]);

  const handleStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/companies/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setCompanies((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setUpdatingId(deleteId);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/companies/${deleteId}`, {
        method: "DELETE",
      });
      setCompanies((prev) => prev.filter((c) => c._id !== deleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
      setDeleteOpen(false);
      setDeleteId(null);
      setDeleteName("");
    }
  };

  const filtered = companies.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.recruiterEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = ["all", "pending", "approved", "rejected"];

  return (
    <div className="min-h-screen px-4 md:px-8 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">Manage Companies</h1>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Review and approve company registrations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                style={{
                  background: filter === t ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                  border: filter === t ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  color: filter === t ? "#818cf8" : "rgba(255,255,255,0.5)",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <FiSearch
              size={13}
              color="rgba(255,255,255,0.3)"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              placeholder="Search company or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs text-white outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader size={22} color="#6366f1" className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white font-medium mb-1">No companies found</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Try changing the filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((company) => {
              const s = statusColors[company.status] || statusColors.pending;
              const isUpdating = updatingId === company._id;

              return (
                <div
                  key={company._id}
                  className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 text-sm font-bold text-white"
                      style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)" }}
                    >
                      {company.logo
                        ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                        : company.name?.[0]?.toUpperCase()
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{company.name}</p>
                      <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {company.recruiterEmail} · {company.industry}
                      </p>
                    </div>
                  </div>

                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full self-start sm:self-auto capitalize"
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                  >
                    {company.status}
                  </span>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {company.status !== "approved" && (
                      <button
                        onClick={() => handleStatus(company._id, "approved")}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90"
                        style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" }}
                      >
                        {isUpdating ? <FiLoader size={12} className="animate-spin" /> : <FiCheck size={12} />}
                        Approve
                      </button>
                    )}
                    {company.status !== "rejected" && (
                      <button
                        onClick={() => handleStatus(company._id, "rejected")}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90"
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
                      >
                        {isUpdating ? <FiLoader size={12} className="animate-spin" /> : <FiX size={12} />}
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setDeleteId(company._id);
                        setDeleteName(company.name || "this company");
                        setDeleteOpen(true);
                      }}
                      disabled={isUpdating}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#f87171",
                      }}
                    >
                      <FiTrash2 size={12} /> Delete
                    </button>
                  </div>
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
            <h3 className="text-lg font-semibold text-white">Delete company?</h3>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Are you sure you want to delete <span className="text-white">{deleteName}</span>? This action cannot be undone.
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
};

export default AdminCompaniesPage;