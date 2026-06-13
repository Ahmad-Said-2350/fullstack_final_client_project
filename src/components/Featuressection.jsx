import React from "react";
import { FiSearch, FiTrendingUp, FiBookmark, FiZap } from "react-icons/fi";
import { MdBusinessCenter, MdOutlineDescription, MdOutlinePeople, MdOutlineTrendingUp } from "react-icons/md";

const features = [
  {
    icon: FiSearch,
    title: "Smart Search",
    description: "Find your ideal job with advanced filters.",
  },
  {
    icon: FiTrendingUp,
    title: "Salary Insights",
    description: "Get real salary data to negotiate confidently.",
  },
  {
    icon: MdBusinessCenter,
    title: "Top Companies",
    description: "Apply to vetted companies that are hiring.",
  },
  {
    icon: FiBookmark,
    title: "Saved Jobs",
    description: "Manage apps & favorites on your dashboard.",
  },
  {
    icon: FiZap,
    title: "One-Click Apply",
    description: "Simplify your job applications for an easier process.",
  },
  {
    icon: MdOutlineDescription,
    title: "Resume Builder",
    description: "Create professional resumes with modern templates.",
  },
  {
    icon: MdOutlinePeople,
    title: "Skill-Based Matching",
    description: "Discover jobs that match your skills and experience.",
  },
  {
    icon: MdOutlineTrendingUp,
    title: "Career Growth Resources",
    description: "Boost your career with quick interview tips.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center">

        {/* Section Label */}
        <div className="flex items-center gap-2 mb-4">
          <span style={{ color: "#6366f1", fontSize: "10px" }}>■</span>
          <span
            className="text-xs tracking-widest uppercase font-medium"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Features Job
          </span>
          <span style={{ color: "#6366f1", fontSize: "10px" }}>■</span>
        </div>

        {/* Heading */}
        <h2
          className="font-bold text-white text-center mb-14"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            lineHeight: "1.25",
            maxWidth: "420px",
          }}
        >
          Everything you need to succeed
        </h2>

        {/* Features Grid — 4 col desktop, 2 col tablet, 1 col mobile */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-3 p-5 rounded-2xl transition-all duration-200 hover:border-white/15"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Icon Box */}
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Icon size={18} color="rgba(255,255,255,0.55)" />
              </div>

              {/* Title */}
              <h3
                className="font-semibold text-white"
                style={{ fontSize: "0.9rem" }}
              >
                {title}
              </h3>

              {/* Description */}
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;