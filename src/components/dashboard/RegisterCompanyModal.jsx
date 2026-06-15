"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { FiX, FiUpload, FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";

const industries = ["Technology", "Fintech", "AI", "Developer Tools", "E-Commerce", "Healthcare", "Education", "Other"];
const employeeRanges = ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "501-1000 employees", "1000+ employees"];

const RegisterCompanyModal = ({ company, onClose, onSuccess }) => {
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({
    name: company?.name || "",
    industry: company?.industry || "",
    website: company?.website || "",
    location: company?.location || "",
    employeeCount: company?.employeeCount || employeeRanges[0],
    description: company?.description || "",
    logo: company?.logo || "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(company?.logo || "");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const uploadToImgbb = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!data.success) return null; // upload fail হলে null return
      return data.data.url;
    } catch {
      return null; // error হলেও null — logo optional
    }
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Company name is required.";
    if (!form.industry) err.industry = "Please select an industry.";
    if (!form.location.trim()) err.location = "Location is required.";
    if (!form.description.trim()) err.description = "Description is required.";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setLoading(true);

    try {
      let logoUrl = form.logo || "";

      // Logo upload — optional, failure তে block করবে না
      if (logoFile) {
        const uploaded = await uploadToImgbb(logoFile);
        if (uploaded) logoUrl = uploaded;
        // upload fail হলে logoUrl empty string থাকবে — কোনো error নয়
      }

      const payload = {
        ...form,
        logo: logoUrl,
        recruiterEmail: session?.user?.email,
        recruiterName: session?.user?.name,
      };

      const url = company
        ? `${process.env.NEXT_PUBLIC_API_URL}/companies/${company._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/companies`;

      const method = company ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Safe JSON parse
      const text = await res.text();
      const result = text ? JSON.parse(text) : {};

      if (!res.ok) throw new Error(result?.message || "Failed to save company");

      setStatus({
        type: "success",
        message: company
          ? "Company updated! Pending re-approval."
          : "Company registered! Awaiting admin approval.",
      });

      setTimeout(() => onSuccess?.(), 1200);

    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    background: errors[field] ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.04)",
    border: errors[field] ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#ffffff",
    padding: "10px 14px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  });

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "500",
    color: "rgba(255,255,255,0.5)",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl flex flex-col max-h-[90vh]"
        style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">
              {company ? "Edit Company" : "Register New Company"}
            </h2>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              {company
                ? "Update your business details."
                : "Enter your business details to start hiring on HireLoop."}
            </p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {/* Status */}
        {status && (
          <div className="px-6 pb-2">
            <div
              className="flex items-start gap-2 p-3 rounded-xl"
              style={{
                background: status.type === "success" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                border: status.type === "success"
                  ? "1px solid rgba(34,197,94,0.25)"
                  : "1px solid rgba(239,68,68,0.25)",
              }}
            >
              {status.type === "success"
                ? <FiCheckCircle size={15} color="#4ade80" style={{ flexShrink: 0, marginTop: "1px" }} />
                : <FiAlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: "1px" }} />
              }
              <p
                className="text-xs"
                style={{
                  color: status.type === "success"
                    ? "rgba(74,222,128,0.9)"
                    : "rgba(248,113,113,0.9)",
                }}
              >
                {status.message}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-4 overflow-y-auto">

          {/* Company Name + Industry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Company Name *</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="e.g. Acme Corp"
                style={inputStyle("name")}
              />
              {errors.name && (
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#f87171" }}>
                  <FiAlertCircle size={11} />{errors.name}
                </p>
              )}
            </div>
            <div>
              <label style={labelStyle}>Industry / Category *</label>
              <select name="industry" value={form.industry} onChange={handleChange} style={inputStyle("industry")}>
                <option value="" disabled style={{ background: "#1a1a1a" }}>Select industry</option>
                {industries.map((i) => (
                  <option key={i} value={i} style={{ background: "#1a1a1a" }}>{i}</option>
                ))}
              </select>
              {errors.industry && (
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#f87171" }}>
                  <FiAlertCircle size={11} />{errors.industry}
                </p>
              )}
            </div>
          </div>

          {/* Website + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Website URL</label>
              <input
                type="text" name="website" value={form.website}
                onChange={handleChange} placeholder="https://www.company.com"
                style={inputStyle("website")}
              />
            </div>
            <div>
              <label style={labelStyle}>Location *</label>
              <input
                type="text" name="location" value={form.location}
                onChange={handleChange} placeholder="City, Country"
                style={inputStyle("location")}
              />
              {errors.location && (
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#f87171" }}>
                  <FiAlertCircle size={11} />{errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Employee Count + Logo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Employee Count Range</label>
              <select
                name="employeeCount" value={form.employeeCount}
                onChange={handleChange} style={inputStyle("employeeCount")}
              >
                {employeeRanges.map((r) => (
                  <option key={r} value={r} style={{ background: "#1a1a1a" }}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>
                Company Logo{" "}
                <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>(optional)</span>
              </label>
              <label
                className="flex items-center gap-3 px-3 py-[7px] rounded-xl cursor-pointer transition-colors hover:bg-white/[0.04]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px dashed rgba(255,255,255,0.15)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <FiUpload size={15} color="rgba(255,255,255,0.4)" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-white">Upload image</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    PNG, JPG up to 5MB
                  </p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Brief Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell us about your company's mission and culture..."
              rows={4}
              style={{ ...inputStyle("description"), resize: "vertical" }}
            />
            {errors.description && (
              <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#f87171" }}>
                <FiAlertCircle size={11} />{errors.description}
              </p>
            )}
          </div>

        </form>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 p-6 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-[10px] rounded-xl text-sm font-medium transition-colors hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-[10px] rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{
              background: loading ? "rgba(255,255,255,0.3)" : "#ffffff",
              color: "#0a0a0a",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? <><FiLoader size={14} className="animate-spin" /> Saving...</>
              : company ? "Update Company" : "Register Company"
            }
          </button>
        </div>

      </div>
    </div>
  );
};

export default RegisterCompanyModal;