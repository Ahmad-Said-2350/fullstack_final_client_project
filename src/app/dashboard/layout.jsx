"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { MdMenu } from "react-icons/md";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full z-30 transition-transform duration-300
          md:relative md:translate-x-0 md:flex md:flex-shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <DashboardSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile Top Bar */}
        <div
          className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-10"
          style={{
            background: "#0f0f0f",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/70 p-1"
          >
            <MdMenu size={22} />
          </button>
          <span className="text-white text-sm font-semibold">HireLoop</span>
          <div className="w-6" />
        </div>

        {/* Page */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;