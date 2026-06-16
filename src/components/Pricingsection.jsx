"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiCheck, FiZap, FiStar, FiBriefcase } from "react-icons/fi";
import { MdWorkspacePremium } from "react-icons/md";

const seekerPlans = [
  {
    id: "free",
    name: "Free",
    icon: FiZap,
    price: 0,
    description: "Get started with job hunting",
    features: [
      "Apply to 3 jobs per month",
      "Save up to 10 jobs",
      "Basic profile",
      "Email alerts",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    icon: FiStar,
    price: 19,
    description: "For serious job seekers",
    features: [
      "Apply to 30 jobs per month",
      "Unlimited saved jobs",
      "Application tracking",
      "Salary insights",
    ],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    icon: MdWorkspacePremium,
    price: 39,
    description: "Unlimited access, maximum results",
    features: [
      "Unlimited applications",
      "Profile boost to recruiters",
      "Early access to new jobs",
      "Priority support",
    ],
    highlighted: false,
  },
];

const recruiterPlans = [
  {
    id: "free",
    name: "Free",
    icon: FiZap,
    price: 0,
    description: "Great for your first year of hiring",
    features: [
      "Up to 3 active job posts",
      "Basic applicant management",
      "Standard listing visibility",
    ],
    highlighted: false,
  },
  {
    id: "growth",
    name: "Growth",
    icon: FiBriefcase,
    price: 49,
    description: "Scale your hiring pipeline",
    features: [
      "Up to 10 active job posts",
      "Applicant tracking",
      "Basic analytics",
      "Email support",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: MdWorkspacePremium,
    price: 149,
    description: "Advanced tools for hiring teams",
    features: [
      "Up to 50 active job posts",
      "Advanced analytics dashboard",
      "Featured job listings",
      "Team collaboration & custom branding",
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("seeker"); // "seeker" | "recruiter"

  const plans = activeTab === "seeker" ? seekerPlans : recruiterPlans;

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
            Pricing
          </span>
          <span style={{ color: "#6366f1", fontSize: "10px" }}>■</span>
        </div>

        {/* Heading */}
        <h2
          className="font-bold text-white text-center mb-8"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            lineHeight: "1.25",
            maxWidth: "520px",
          }}
        >
          Simple pricing for seekers and recruiters
        </h2>

        {/* Toggle — Seeker / Recruiter */}
        <div
          className="flex items-center gap-1 p-1 rounded-full mb-12"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <button
            onClick={() => setActiveTab("seeker")}
            className="px-5 py-[6px] rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: activeTab === "seeker" ? "rgba(255,255,255,0.12)" : "transparent",
              color: activeTab === "seeker" ? "#ffffff" : "rgba(255,255,255,0.45)",
            }}
          >
            For Job Seekers
          </button>
          <button
            onClick={() => setActiveTab("recruiter")}
            className="px-5 py-[6px] rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: activeTab === "recruiter" ? "rgba(255,255,255,0.12)" : "transparent",
              color: activeTab === "recruiter" ? "#ffffff" : "rgba(255,255,255,0.45)",
            }}
          >
            For Recruiters
          </button>
        </div>

        {/* Plans Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className="flex flex-col p-6 rounded-2xl transition-all duration-200"
                style={{
                  background: plan.highlighted
                    ? "rgba(99,102,241,0.08)"
                    : "rgba(255,255,255,0.02)",
                  border: plan.highlighted
                    ? "1px solid rgba(99,102,241,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Plan Name + Price */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Icon size={16} color={plan.highlighted ? "#818cf8" : "rgba(255,255,255,0.5)"} />
                    <span
                      className="font-semibold"
                      style={{
                        color: plan.highlighted ? "#818cf8" : "rgba(255,255,255,0.85)",
                        fontSize: "1rem",
                      }}
                    >
                      {plan.name}
                    </span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="font-bold text-white" style={{ fontSize: "1.6rem", lineHeight: "1" }}>
                      ${plan.price}
                    </span>
                    <span className="text-xs pb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                      /month
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      <FiCheck
                        size={14}
                        style={{
                          color: plan.highlighted ? "#818cf8" : "rgba(255,255,255,0.4)",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => router.push(activeTab === "seeker" ? "/pricing" : "/dashboard/recruiter/billing")}
                  className="w-full flex items-center justify-between px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90"
                  style={{
                    background: plan.highlighted
                      ? "rgba(99,102,241,0.15)"
                      : "rgba(255,255,255,0.04)",
                    border: plan.highlighted
                      ? "1px solid rgba(99,102,241,0.3)"
                      : "1px solid rgba(255,255,255,0.08)",
                    color: plan.highlighted ? "#a5b4fc" : "rgba(255,255,255,0.6)",
                  }}
                >
                  {plan.price === 0 ? "Get Started" : "Choose This Plan"}
                  <FiArrowRight size={15} />
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;