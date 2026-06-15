"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";

const jobTypes = ["Full-time", "Part-time", "Remote", "Contract", "Internship"];
const categories = ["Engineering", "Design", "Marketing", "Sales", "Finance", "HR", "Product", "Other"];
const currencies = ["USD", "EUR", "GBP", "BDT"];

const EditJobPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [isRemote, setIsRemote] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "",
    category: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    city: "",
    country: "",
    deadline: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
  });

  // Fetch existing job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
        const job = await res.json();

        setIsRemote(job.isRemote || false);
        setForm({
          title: job.title || "",
          category: job.category || "",
          jobType: job.jobType || "",
          salaryMin: job.salaryMin || "",
          salaryMax: job.salaryMax || "",
          currency: job.currency || "USD",
          city: job.city || "",
          country: job.country || "",
          deadline: job.deadline ? job.deadline.slice(0, 10) : "",
          responsibilities: job.responsibilities || "",
          requirements: job.requirements || "",
          benefits: job.benefits || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = "Job title is required.";
    if (!form.category) err.category = "Please select a category.";
    if (!form.jobType) err.jobType = "Please select a job type.";
    if (!form.salaryMin) err.salaryMin = "Minimum salary is required.";
    if (!form.salaryMax) err.salaryMax = "Maximum salary is required.";
    if (!isRemote && !form.city.trim()) err.city = "City is required.";
    if (!isRemote && !form.country.trim()) err.country = "Country is required.";
    if (!form.deadline) err.deadline = "Application deadline is required.";
    if (!form.responsibilities.trim()) err.responsibilities = "Responsibilities are required.";
    if (!form.requirements.trim()) err.requirements = "Requirements are required.";
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

    setSaving(true);
    try {
      const payload = {
        ...form,
        isRemote,
        location: isRemote ? "Remote" : `${form.city}, ${form.country}`,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update job");

      setStatus({ type: "success", message: "Job updated successfully! Redirecting..." });
      setTimeout(() => router.push("/dashboard/recruiter/jobs"), 2000);
    } catch {
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (field) => ({
    background: errors[field] ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.04)",
    border: errors[field] ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0a0a0a" }}>
        <FiLoader size={24} color="#6366f1" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: "#0a0a0a" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard/recruiter/jobs"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <FiArrowLeft size={15} color="rgba(255,255,255,0.6)" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Edit Job</h1>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              Update your job listing details.
            </p>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className="flex items-start gap-3 p-4 rounded-xl mb-6"
            style={{
              background: status.type === "success" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border: status.type === "success" ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(239,68,68,0.25)",
            }}
          >
            {status.type === "success"
              ? <FiCheckCircle size={17} color="#4ade80" style={{ flexShrink: 0, marginTop: "1px" }} />
              : <FiAlertCircle size={17} color="#f87171" style={{ flexShrink: 0, marginTop: "1px" }} />
            }
            <p className="text-sm" style={{ color: status.type === "success" ? "rgba(74,222,128,0.9)" : "rgba(248,113,113,0.9)" }}>
              {status.message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Section 1: Job Info */}
          <div
            className="p-6 rounded-2xl flex flex-col gap-5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h2 className="text-sm font-semibold text-white">Job Information</h2>

            <div>
              <label style={labelStyle}>Job Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer" style={inputStyle("title")} />
              {errors.title && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#f87171" }}><FiAlertCircle size={11} />{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} style={inputStyle("category")}>
                  <option value="" disabled style={{ background: "#1a1a1a" }}>Select category</option>
                  {categories.map((c) => <option key={c} value={c} style={{ background: "#1a1a1a" }}>{c}</option>)}
                </select>
                {errors.category && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#f87171" }}><FiAlertCircle size={11} />{errors.category}</p>}
              </div>
              <div>
                <label style={labelStyle}>Job Type *</label>
                <select name="jobType" value={form.jobType} onChange={handleChange} style={inputStyle("jobType")}>
                  <option value="" disabled style={{ background: "#1a1a1a" }}>Select type</option>
                  {jobTypes.map((t) => <option key={t} value={t} style={{ background: "#1a1a1a" }}>{t}</option>)}
                </select>
                {errors.jobType && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#f87171" }}><FiAlertCircle size={11} />{errors.jobType}</p>}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Salary Range *</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange}
                    placeholder="Min" style={inputStyle("salaryMin")} />
                  {errors.salaryMin && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.salaryMin}</p>}
                </div>
                <div>
                  <input type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange}
                    placeholder="Max" style={inputStyle("salaryMax")} />
                  {errors.salaryMax && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.salaryMax}</p>}
                </div>
                <div>
                  <select name="currency" value={form.currency} onChange={handleChange} style={inputStyle("currency")}>
                    {currencies.map((c) => <option key={c} value={c} style={{ background: "#1a1a1a" }}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label style={{ ...labelStyle, marginBottom: 0 }}>Location *</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setIsRemote(!isRemote)}
                    className="w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer"
                    style={{ background: isRemote ? "#6366f1" : "rgba(255,255,255,0.1)" }}
                  >
                    <div
                      className="absolute top-[2px] w-4 h-4 rounded-full bg-white transition-all duration-200"
                      style={{ left: isRemote ? "18px" : "2px" }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Remote</span>
                </label>
              </div>
              {!isRemote ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input type="text" name="city" value={form.city} onChange={handleChange}
                      placeholder="City" style={inputStyle("city")} />
                    {errors.city && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.city}</p>}
                  </div>
                  <div>
                    <input type="text" name="country" value={form.country} onChange={handleChange}
                      placeholder="Country" style={inputStyle("country")} />
                    {errors.country && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.country}</p>}
                  </div>
                </div>
              ) : (
                <div
                  className="px-4 py-3 rounded-xl text-sm"
                  style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc" }}
                >
                  This job is fully remote 🌍
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Application Deadline *</label>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} style={inputStyle("deadline")} />
              {errors.deadline && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#f87171" }}><FiAlertCircle size={11} />{errors.deadline}</p>}
            </div>
          </div>

          {/* Section 2: Job Description */}
          <div
            className="p-6 rounded-2xl flex flex-col gap-5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h2 className="text-sm font-semibold text-white">Job Description</h2>

            <div>
              <label style={labelStyle}>Responsibilities *</label>
              <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange}
                placeholder="List the key responsibilities..." rows={4}
                style={{ ...inputStyle("responsibilities"), resize: "vertical" }} />
              {errors.responsibilities && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#f87171" }}><FiAlertCircle size={11} />{errors.responsibilities}</p>}
            </div>

            <div>
              <label style={labelStyle}>Requirements *</label>
              <textarea name="requirements" value={form.requirements} onChange={handleChange}
                placeholder="List the required skills and experience..." rows={4}
                style={{ ...inputStyle("requirements"), resize: "vertical" }} />
              {errors.requirements && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#f87171" }}><FiAlertCircle size={11} />{errors.requirements}</p>}
            </div>

            <div>
              <label style={labelStyle}>Benefits <span style={{ color: "rgba(255,255,255,0.25)" }}>(optional)</span></label>
              <textarea name="benefits" value={form.benefits} onChange={handleChange}
                placeholder="Health insurance, remote work, stock options..." rows={3}
                style={{ ...inputStyle("benefits"), resize: "vertical" }} />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pb-8">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{
                background: saving ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #7c3aed)",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? <><FiLoader size={15} className="animate-spin" /> Saving...</> : "Save Changes"}
            </button>
            <Link
              href="/dashboard/recruiter/jobs"
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditJobPage;