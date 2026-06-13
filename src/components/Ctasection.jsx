import React from "react";
import Image from "next/image";
import Link from "next/link";
import ctaBg from "@/assets/cta.png";

const CTASection = () => {
  return (
    <section
      className="w-full relative flex flex-col items-center justify-center overflow-hidden py-28 px-4"
      style={{ background: "#0a0a0a" }}
    >

      {/* Background image layer */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <Image
          src={ctaBg}
          alt="CTA Background"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
            mixBlendMode: "screen",
            opacity: 0.6,
          }}
          priority
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto" style={{ zIndex: 1 }}>

        {/* Heading */}
        <h2
          className="font-bold text-white mb-4"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            lineHeight: "1.25",
          }}
        >
          Your next role is <br />
          already looking for you
        </h2>

        {/* Subheadline */}
        <p
          className="mb-8 text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.45)", maxWidth: "380px" }}
        >
          Build a profile in three minutes. The matches start arriving tomorrow morning.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="px-5 py-[10px] rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90"
            style={{ background: "#ffffff", color: "#0a0a0a" }}
          >
            Create a free account
          </Link>

          <Link
            href="/pricing"
            className="px-5 py-[10px] rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            View pricing
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CTASection;