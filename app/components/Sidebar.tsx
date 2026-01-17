"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-3 py-2 rounded-md transition ${
      pathname === path
        ? "bg-white text-black font-semibold"
        : "text-gray-300 hover:text-white hover:bg-gray-800"
    }`;

  return (
    <aside className="w-64 bg-black text-white min-h-screen p-6">
      <h1 className="text-xl font-bold mb-8">
        Smart Attendance
      </h1>

      <nav className="space-y-2 text-sm">
        <p className="text-gray-400 uppercase text-xs mb-2">
          Admin
        </p>

        <Link href="/dashboard" className={linkClass("/dashboard")}>
          📊 Dashboard
        </Link>

        <Link
          href="/dashboard/attendance"
          className={linkClass("/dashboard/attendance")}
        >
          📋 Attendance
        </Link>

        <Link
          href="/employees"
          className={linkClass("/employees")}
        >
          👥 Employees
        </Link>

        <Link
          href="/register"
          className={linkClass("/register")}
        >
          ➕ Register Employee
        </Link>
      </nav>
    </aside>
  );
}
