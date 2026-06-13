import React from "react";
import Link from "next/link";
import { FiMapPin, FiDollarSign, FiArrowRight } from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25–€40/hour",
  },
  {
    id: 2,
    title: "Frontend Developer",
    description: "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25–€40/hour",
  },
  {
    id: 3,
    title: "Frontend Developer",
    description: "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25–€40/hour",
  },
  {
    id: 4,
    title: "Frontend Developer",
    description: "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25–€40/hour",
  },
  {
    id: 5,
    title: "Frontend Developer",
    description: "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25–€40/hour",
  },
  {
    id: 6,
    title: "Frontend Developer",
    description: "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "€25–€40/hour",
  },
];

const FeaturedJobs = () => {
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
            Smart Job Discovery
          </span>
          <span style={{ color: "#6366f1", fontSize: "10px" }}>■</span>
        </div>

        {/* Heading */}
        <h2
          className="font-bold text-white text-center mb-12"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: "1.25", maxWidth: "480px" }}
        >
          The roles you  never find by searching
        </h2>

        {/* Jobs Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col justify-between p-5 rounded-2xl transition-all duration-200 hover:border-white/20"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                minHeight: "200px",
              }}
            >
              {/* Top — Title + Description */}
              <div className="flex flex-col gap-2 mb-4">
                <h3
                  className="font-bold text-white"
                  style={{ fontSize: "1.1rem" }}
                >
                  {job.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {job.description}
                </p>
              </div>

              {/* Middle — Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {/* Location */}
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  <FiMapPin size={11} />
                  <span>{job.location}</span>
                </div>

                {/* Type */}
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  <MdWorkOutline size={11} />
                  <span>{job.type}</span>
                </div>

                {/* Salary */}
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  <FiDollarSign size={11} />
                  <span>{job.salary}</span>
                </div>
              </div>

              {/* Divider */}
              <div
                className="w-full mb-4"
                style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
              />

              {/* Bottom — Apply Now */}
              <Link
                href={`/jobs/${job.id}`}
                className="flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:gap-2"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Apply Now
                <FiArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button
          className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/10"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          View all job open
        </button>

      </div>
    </section>
  );
};

export default FeaturedJobs;