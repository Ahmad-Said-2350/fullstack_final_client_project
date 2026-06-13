"use client";

import React, { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { MdAdd } from "react-icons/md";

const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: "🏅",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Start building your insights hub:",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company Insight dashboards",
      "1-click apply, unlimited",
    ],
    highlighted: false,
  },
  {
    id: "growth",
    name: "Growth",
    icon: "📊",
    monthlyPrice: 17,
    yearlyPrice: 12,
    description: "Start building your insights hub:",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company Insight dashboards",
      "1-click apply, unlimited",
    ],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    icon: "⚡",
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: "Start building your insights hub:",
    features: [
      "Everything in Pro",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

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
            maxWidth: "440px",
          }}
        >
          Pay for the leverage, not the listings
        </h2>

        {/* Toggle — Monthly / Yearly */}
        <div
          className="flex items-center gap-1 p-1 rounded-full mb-12"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <button
            onClick={() => setIsYearly(false)}
            className="px-4 py-[6px] rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: !isYearly ? "rgba(255,255,255,0.12)" : "transparent",
              color: !isYearly ? "#ffffff" : "rgba(255,255,255,0.45)",
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className="flex items-center gap-2 px-4 py-[6px] rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: isYearly ? "rgba(255,255,255,0.12)" : "transparent",
              color: isYearly ? "#ffffff" : "rgba(255,255,255,0.45)",
            }}
          >
            Yearly
            <span
              className="text-xs font-semibold px-2 py-[2px] rounded-full"
              style={{ background: "#6366f1", color: "#ffffff" }}
            >
              25%
            </span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
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
                  <span className="text-lg">{plan.icon}</span>
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
                  <span
                    className="font-bold text-white"
                    style={{ fontSize: "1.6rem", lineHeight: "1" }}
                  >
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span
                    className="text-xs pb-1"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    /month
                  </span>
                </div>
              </div>

              {/* Description */}
              <p
                className="text-sm mb-4"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
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
                    <MdAdd
                      size={16}
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
                className="w-full flex items-center justify-between px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
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
                Choose This Plan
                <FiArrowRight size={15} />
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;