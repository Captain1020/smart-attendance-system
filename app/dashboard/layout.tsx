"use client";

import Sidebar from "@/app/components/Sidebar";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-black text-white">
        <Sidebar />
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Mobile Top Bar */}
        <div className="md:hidden bg-black text-white p-4 flex justify-between">
          <span className="font-bold">Smart Attendance</span>
          <Link href="/employees" className="text-sm underline">
            Menu
          </Link>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
