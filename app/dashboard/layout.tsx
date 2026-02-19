"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:block w-64 bg-black text-white">
        <Sidebar />
      </aside>

      {/* ================= MOBILE SIDEBAR OVERLAY ================= */}
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

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col">

        {/* ================= MOBILE TOP BAR ================= */}
        <div className="md:hidden bg-black text-white p-4 flex justify-between items-center">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-sm underline"
          >
            Menu
          </button>

          <span className="font-bold">Smart Attendance</span>

          <button
            onClick={logout}
            className="text-sm bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {/* ================= PAGE CONTENT ================= */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
