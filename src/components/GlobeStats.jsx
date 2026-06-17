"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiBriefcase, FiBarChart2, FiSearch, FiStar } from "react-icons/fi";
import globe from "@/assets/globe.png";

const formatNumber = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
};

const GlobeStats = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalCompanies: 0,
    totalSeekers: 0,
    satisfactionRate: 97,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/platform/stats`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: FiBriefcase, value: formatNumber(stats.activeJobs),    label: "Active Jobs" },
    { icon: FiBarChart2, value: formatNumber(stats.totalCompanies), label: "Companies" },
    { icon: FiSearch,    value: formatNumber(stats.totalSeekers),   label: "Job Seekers" },
    { icon: FiStar,      value: `${stats.satisfactionRate}%`,       label: "Satisfaction Rate" },
  ];

  return (
    <section className="w-full flex flex-col items-center overflow-hidden">

      {/* ── Globe wrapper ── */}
      <div className="relative w-full flex flex-col items-center">

        {/* Globe image — hidden on small screens, visible md+ */}
        <div
          className="relative mx-auto justify-center hidden md:flex"
          style={{ width: "min(680px, 90vw)" }}
        >
          <Image
            src={globe}
            alt="Globe"
            width={680}
            height={680}
            className="w-full h-auto"
            style={{
              mixBlendMode: "lighten",
              maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 85%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 85%)",
            }}
          />

          {/* Assisting text — desktop only, inside globe */}
          <div
            className="absolute left-0 right-0 text-center px-4"
            style={{ top: "52%" }}
          >
            <p
              className="text-2xl lg:text-4xl font-medium"
              style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.7" }}
            >
              Assisting over{" "}
              <span style={{ color: "#ffffff", fontWeight: "700" }}>
                {formatNumber(stats.totalSeekers)} job seekers
              </span>
              <br />
              find their dream positions.
            </p>
          </div>
        </div>

        {/* Assisting text — mobile only, above cards, no globe overlap */}
        <div className="md:hidden text-center px-6 py-8">
          <p
            className="text-xl font-medium"
            style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.7" }}
          >
            Assisting over{" "}
            <span style={{ color: "#ffffff", fontWeight: "700" }}>
              {formatNumber(stats.totalSeekers)} job seekers
            </span>
            <br />
            find their dream positions.
          </p>
        </div>

        {/* Stats Cards */}
        <div
          className="w-full px-4 grid grid-cols-2 md:grid-cols-4 gap-3"
          style={{
            maxWidth: "900px",
            marginTop: "0",         /* mobile: no negative margin */
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Desktop: pull cards up into globe bottom edge */}
          <style>{`
            @media (min-width: 768px) {
              .globe-cards { margin-top: -80px !important; }
            }
          `}</style>

          {statCards.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="globe-cards flex flex-col gap-3 p-4 md:p-5 rounded-2xl"
              style={{
                background: "rgba(10, 10, 10, 0.92)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <Icon size={16} color="rgba(255,255,255,0.35)" />
              <p
                className="font-bold text-white"
                style={{
                  fontSize: "clamp(1.3rem, 4vw, 2.2rem)",
                  lineHeight: "1",
                }}
              >
                {value}
              </p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>
                {label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GlobeStats;