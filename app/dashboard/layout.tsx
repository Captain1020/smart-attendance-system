"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-black text-white">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <aside className="w-64 bg-black text-white">
            <Sidebar />
          </aside>

          {/* Overlay */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Mobile Top Bar */}
        <div className="md:hidden bg-black text-white p-4 flex justify-between items-center">
          <span className="font-bold">Smart Attendance</span>

          <button
            onClick={() => setMenuOpen(true)}
            className="text-sm underline"
          >
            Menu
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
