import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { SiPinterest } from "react-icons/si";
import logo from "@/assets/logo.png"

const footerLinks = {
  Product: [
    { label: "Job discovery", href: "#" },
    { label: "Worker AI", href: "#" },
    { label: "Companies", href: "#" },
    { label: "Salary data", href: "#" },
  ],
  Navigations: [
    { label: "Help center", href: "#" },
    { label: "Career library", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Brand Guideline", href: "#" },
    { label: "Newsroom", href: "#" },
  ],
};

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: SiPinterest, href: "#", label: "Pinterest" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

const iconStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#ffffff99",
  flexShrink: 0,
};

const Footer = () => {
  return (
    <footer
      className="w-full px-6 md:px-16 pt-14 pb-6"
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Top Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">

        {/* Left — Logo + Tagline */}
        <div className="flex flex-col gap-6 w-full md:max-w-[200px]">
          <Link href="/">
            <Image
              src={logo}
              alt="HireLoop Logo"
              width={110}
              height={36}
              priority
              style={{ height: "auto" }}
            />
          </Link>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", lineHeight: "1.6" }}>
            The AI-native career platform. Built for people who take their work seriously.
          </p>
        </div>

        {/* Right — 3 Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-20 w-full md:w-auto">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h4 className="text-sm font-medium text-indigo-400 tracking-wide">
                {category}
              </h4>
              <ul className="flex flex-col gap-[14px]">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/45 hover:text-white/80 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Divider */}
      <div
        className="max-w-6xl mx-auto mt-12 mb-5"
        style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
      />

     
     {/* Bottom Row */}
<div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

  {/* Left — Social Icons */}
  <div className="flex items-center gap-2">
    {socialLinks.map(({ icon: Icon, href, label }) => (
      <Link key={label} href={href} aria-label={label} style={iconStyle}>
        <Icon size={13} />
      </Link>
    ))}
  </div>

  {/* Right — Copyright + Terms */}
  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-3 gap-y-1"
    style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}
  >
    <p className="whitespace-nowrap">Copyright 2024 —Programming Hero</p>
    <div className="flex items-center gap-1 whitespace-nowrap">
      <Link href="#" className="hover:text-white/50 transition-colors duration-200">
        Terms & Policy
      </Link>
      <span>-</span>
      <Link href="#" className="hover:text-white/50 transition-colors duration-200">
        Privacy Guideline
      </Link>
    </div>
  </div>

</div>
    </footer>
  );
};

export default Footer;