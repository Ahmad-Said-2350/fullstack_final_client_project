"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  console.log(session)

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <div className="w-full sticky top-0 z-50 px-3 pt-3 bg-transparent">
      <nav
        className="w-full rounded-xl px-6 h-14 flex items-center justify-between"
        style={{
          background: "#0f0f0f",
          border: "1px solid rgba(255, 255, 255, 0.10)",
        }}
      >
        {/* Left — Logo */}
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

        {/* Right — Desktop */}
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

          {/* Conditional Rendering */}
          {isPending ? (
            <div
              className="w-20 h-8 rounded-lg animate-pulse"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          ) : session ? (
            <div className="flex items-center gap-3">
              {/* Text Avatar — no image */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
                >
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <span>{session.user.name?.split(" ")[0]}</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}

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

          {isPending ? (
            <div className="w-full h-8 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white/70 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}
                >
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                {session.user.name?.split(" ")[0]} — Dashboard
              </Link>
              <button
                onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                className="text-red-400 text-sm text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;