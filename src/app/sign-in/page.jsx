"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import {
  FiMail, FiLock, FiEye, FiEyeOff,
  FiAlertCircle, FiCheckCircle, FiLoader,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const SignInPage = () => {

  useEffect(() => {
    document.title = "Sign In – HireLoop";
  }, []);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = (email, password) => {
    const errors = {};
    if (!email.trim()) errors.email = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Password is required.";
    return errors;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setStatus(null);
    setFieldErrors({});

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const errors = validate(email, password);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    const { error } = await signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (error) {
      setStatus({
        type: "error",
        message: error.message || "Invalid email or password. Please try again.",
      });
    } else {
      setStatus({
        type: "success",
        message: "Signed in successfully! Redirecting to dashboard...",
      });
      setTimeout(() => router.push("/dashboard"), 1500);
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  const handleGithub = async () => {
    await signIn.social({ provider: "github", callbackURL: "/dashboard" });
  };

  const inputStyle = (field) => ({
    background: fieldErrors[field] ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.04)",
    border: fieldErrors[field]
      ? "1px solid rgba(239,68,68,0.4)"
      : "1px solid rgba(255,255,255,0.08)",
  });

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{ background: "#0a0a0a" }}
    >
      <div className="w-full max-w-md">

        

        {/* Card */}
        <div
          className="w-full p-8 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white mb-1">
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Sign in to your HireLoop account to continue.
            </p>
          </div>

          {/* Global Status Message */}
          {status && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl mb-5"
              style={{
                background: status.type === "success"
                  ? "rgba(34,197,94,0.08)"
                  : "rgba(239,68,68,0.08)",
                border: status.type === "success"
                  ? "1px solid rgba(34,197,94,0.25)"
                  : "1px solid rgba(239,68,68,0.25)",
              }}
            >
              {status.type === "success"
                ? <FiCheckCircle size={17} color="#4ade80" style={{ flexShrink: 0, marginTop: "1px" }} />
                : <FiAlertCircle size={17} color="#f87171" style={{ flexShrink: 0, marginTop: "1px" }} />
              }
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: status.type === "success"
                    ? "rgba(74,222,128,0.9)"
                    : "rgba(248,113,113,0.9)",
                }}
              >
                {status.message}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                Email Address
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={inputStyle("email")}
              >
                <FiMail size={15} color="rgba(255,255,255,0.3)" />
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  onChange={() => setFieldErrors((p) => ({ ...p, email: "" }))}
                  className="bg-transparent outline-none w-full text-sm text-white placeholder:text-white/25"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs flex items-center gap-1 mt-1" style={{ color: "#f87171" }}>
                  <FiAlertCircle size={11} /> {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Password
                </label>
              
              </div>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={inputStyle("password")}
              >
                <FiLock size={15} color="rgba(255,255,255,0.3)" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Your password"
                  onChange={() => setFieldErrors((p) => ({ ...p, password: "" }))}
                  className="bg-transparent outline-none w-full text-sm text-white placeholder:text-white/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex-shrink-0"
                >
                  {showPassword
                    ? <FiEyeOff size={15} color="rgba(255,255,255,0.3)" />
                    : <FiEye size={15} color="rgba(255,255,255,0.3)" />
                  }
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs flex items-center gap-1 mt-1" style={{ color: "#f87171" }}>
                  <FiAlertCircle size={11} /> {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 mt-1 flex items-center justify-center gap-2"
              style={{
                background: loading
                  ? "rgba(99,102,241,0.5)"
                  : "linear-gradient(135deg, #6366f1, #7c3aed)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <><FiLoader size={15} className="animate-spin" /> Signing In...</>
              ) : "Sign In"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              or continue with
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogle}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <FcGoogle size={17} /> Google
            </button>
            <button
              type="button"
              onClick={handleGithub}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <FaGithub size={17} color="rgba(255,255,255,0.8)" /> GitHub
            </button>
          </div>

        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm mt-5" style={{ color: "rgba(255,255,255,0.35)" }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium transition-colors duration-200 hover:text-indigo-300"
            style={{ color: "#818cf8" }}
          >
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignInPage;