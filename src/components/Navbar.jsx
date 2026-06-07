"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png"


const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full sticky top-0 z-50 px-3 pt-3 bg-transparent">
      <nav
        className="w-full rounded-xl px-6 h-14 flex items-center justify-between"
        style={{
          background: "#0f0f0f",
          border: "1px solid rgba(255, 255, 255, 0.10)",
        }}
      >
        {/* Left — Logo only */}
        <Link href="/">
          <Image
            src={logo}
            alt="HireLoop Logo"
            width={110}
            height={36}
            priority
            style={{ width: "110px", height: "auto" }}
          />
        </Link>

        {/* Right — Nav Links + Divider + Sign In + Get Started */}
        <div className="hidden md:flex items-center gap-6">
          
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white/60 hover:text-white text-sm transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="w-px h-4 bg-white/20" />

          <Link
            href="/sign-in"
            className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors duration-200"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-all duration-200"
          >
            Get Started
          </Link>

        </div>

        {/* Mobile — Hamburger */}
        <button
          className="md:hidden text-white/70 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden mt-1 rounded-xl px-6 py-5 flex flex-col gap-4"
          style={{
            background: "#0f0f0f",
            border: "1px solid rgba(255, 255, 255, 0.10)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white/70 hover:text-white text-sm transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-full h-px bg-white/10" />
          <Link
            href="/sign-in"
            className="text-indigo-400 text-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-lg text-center transition-all duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;