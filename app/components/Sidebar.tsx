"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black text-white min-h-screen p-6">
      <h1 className="text-xl font-bold mb-8">Smart Attendance</h1>

      <nav className="space-y-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/employees">Employees</Link>
        <Link href="/attendance">Attendance</Link>
        <Link href="/reports">Reports</Link>
      </nav>
    </aside>
  );
}
