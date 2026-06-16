"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiMapPin, FiBriefcase } from "react-icons/fi";

const trendingTags = ["Product Designer", "AI Engineering", "Dev-ops Engineer"];

const HeroSection = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (location) params.append("location", location);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tag) => {
    router.push(`/jobs?search=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="w-full flex flex-col items-center text-center px-4 py-20">

      {/* Badge */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full mb-8"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <FiBriefcase size={14} color="#f87171" />
        <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
          50,000+ <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: "400" }}>NEW JOBS THIS MONTH</span>
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
        Find Your Dream Job <br /> Today
      </h1>

      {/* Subheadline */}
      <p className="max-w-xl text-sm sm:text-base mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
        HireLoop connects top talent with world-class companies. Browse thousands of curated opportunities and land your next role — faster.
      </p>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-2xl flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-2xl mb-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2 flex-1 px-3">
          <FiSearch size={15} color="rgba(255,255,255,0.3)" />
          <input
            type="text"
            placeholder="Job title, skill or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full py-2 text-white placeholder:text-white/30"
          />
        </div>

        <div
          className="hidden sm:block"
          style={{ width: "1px", background: "rgba(255,255,255,0.08)" }}
        />

        <div className="flex items-center gap-2 flex-1 px-3">
          <FiMapPin size={15} color="rgba(255,255,255,0.3)" />
          <input
            type="text"
            placeholder="Location or Remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent outline-none text-sm w-full py-2 text-white placeholder:text-white/30"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 self-end sm:self-center transition-all duration-200 hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
        >
          <FiSearch size={16} color="#ffffff" />
        </button>
      </form>

      {/* Trending Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Trending Position</span>
        {trendingTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
          >
            {tag}
          </button>
        ))}
      </div>

    </section>
  );
};

export default HeroSection;