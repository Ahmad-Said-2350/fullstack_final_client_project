"use client";

import { useState, useEffect } from "react";
import { FiLoader, FiSearch, FiShield, FiUser } from "react-icons/fi";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [targetId, setTargetId] = useState(null);
  const [targetLabel, setTargetLabel] = useState("");
  const [targetValue, setTargetValue] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (roleFilter !== "all") params.append("role", roleFilter);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const handleRoleChange = async () => {
    if (!targetId) return;
    setUpdatingId(targetId);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${targetId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetValue }),
      });
      setUsers((prev) => prev.map((u) => (u._id === targetId ? { ...u, role: targetValue } : u)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
      setActionOpen(false);
      setTargetId(null);
      setTargetLabel("");
      setTargetValue("");
      setActionType("");
    }
  };

  const handleBan = async () => {
    if (!targetId) return;
    setUpdatingId(targetId);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${targetId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banned: targetValue === "true" }),
      });
      setUsers((prev) => prev.map((u) => (u._id === targetId ? { ...u, banned: targetValue === "true" } : u)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
      setActionOpen(false);
      setTargetId(null);
      setTargetLabel("");
      setTargetValue("");
      setActionType("");
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const roleColors = {
    Recruiter: { bg: "rgba(99,102,241,0.1)", color: "#818cf8", border: "rgba(99,102,241,0.2)" },
    "Job Seeker": { bg: "rgba(34,197,94,0.1)", color: "#4ade80", border: "rgba(34,197,94,0.2)" },
    admin: { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "rgba(251,191,36,0.2)" },
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">Manage Users</h1>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            View and manage all platform users.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2">
            {["all", "Job Seeker", "Recruiter"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: roleFilter === r ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                  border: roleFilter === r ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  color: roleFilter === r ? "#818cf8" : "rgba(255,255,255,0.5)",
                }}
              >
                {r === "all" ? "All" : r}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); fetchUsers(); }} className="flex gap-2 flex-1 max-w-xs">
            <div className="relative flex-1">
              <FiSearch size={13} color="rgba(255,255,255,0.3)"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs text-white outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", color: "#fff" }}
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader size={22} color="#6366f1" className="animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white font-medium">No users found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {users.map((user) => {
              const rs = roleColors[user.role] || roleColors["Job Seeker"];
              const isUpdating = updatingId === user._id;

              return (
                <div
                  key={user._id}
                  className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: user.banned
                      ? "1px solid rgba(239,68,68,0.2)"
                      : "1px solid rgba(255,255,255,0.07)",
                    opacity: user.banned ? 0.7 : 1,
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
                    >
                      {user.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{user.name || "—"}</p>
                      <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {user.email} · Joined {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full self-start sm:self-auto"
                    style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.border}` }}
                  >
                    {user.role || "Job Seeker"}
                  </span>

                  {user.banned && (
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
                    >
                      Suspended
                    </span>
                  )}

                  {user.role !== "admin" && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          const nextRole = user.role === "Recruiter" ? "Job Seeker" : "Recruiter";
                          setTargetId(user._id);
                          setTargetLabel(user.name || user.email || "this user");
                          setTargetValue(nextRole);
                          setActionType("role");
                          setActionOpen(true);
                        }}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/10"
                        style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                      >
                        {isUpdating ? <FiLoader size={12} className="animate-spin" /> : <FiShield size={12} />}
                        {user.role === "Recruiter" ? "Make Seeker" : "Make Recruiter"}
                      </button>

                      <button
                        onClick={() => {
                          setTargetId(user._id);
                          setTargetLabel(user.name || user.email || "this user");
                          setTargetValue(String(!user.banned));
                          setActionType("ban");
                          setActionOpen(true);
                        }}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                        style={{
                          background: user.banned ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          border: user.banned ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(239,68,68,0.25)",
                          color: user.banned ? "#4ade80" : "#f87171",
                        }}
                      >
                        {isUpdating ? <FiLoader size={12} className="animate-spin" /> : <FiUser size={12} />}
                        {user.banned ? "Activate" : "Suspend"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {actionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              setActionOpen(false);
              setTargetId(null);
              setTargetLabel("");
              setTargetValue("");
              setActionType("");
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
            <h3 className="text-lg font-semibold text-white">
              {actionType === "role" ? "Change user role?" : "Update user status?"}
            </h3>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              {actionType === "role"
                ? <>
                    Are you sure you want to change <span className="text-white">{targetLabel}</span> to <span className="text-white">{targetValue}</span>?
                  </>
                : <>
                    Are you sure you want to {targetValue === "true" ? "suspend" : "activate"} <span className="text-white">{targetLabel}</span>?
                  </>
              }
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setActionOpen(false);
                  setTargetId(null);
                  setTargetLabel("");
                  setTargetValue("");
                  setActionType("");
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
                onClick={actionType === "role" ? handleRoleChange : handleBan}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;