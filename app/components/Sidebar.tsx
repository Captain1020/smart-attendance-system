"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black text-white min-h-screen p-6">
      <h1 className="text-xl font-bold mb-8">
        Smart Attendance
      </h1>

      <nav className="space-y-3 text-sm">
        {/* ADMIN SECTION */}
        <p className="text-gray-400 uppercase text-xs mt-4">
          Admin
        </p>

        <Link href="/dashboard" className="block hover:text-gray-300">
          Dashboard
        </Link>

        <Link href="/dashboard/attendance" className="block hover:text-gray-300">
          Attendance
        </Link>

        <Link href="/employees" className="block hover:text-gray-300">
          Employees
        </Link>

        <Link href="/register" className="block hover:text-gray-300">
          Register Employee
        </Link>

        {/* EMPLOYEE SECTION */}
        <p className="text-gray-400 uppercase text-xs mt-6">
          Employee
        </p>

        <Link href="/employee/attendance" className="block hover:text-gray-300">
          My Attendance
        </Link>

        <Link href="/employee/profile" className="block hover:text-gray-300">
          My Profile
        </Link>
      </nav>
    </aside>
  );
}
