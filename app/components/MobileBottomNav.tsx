"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Role = "admin" | "employee";

export default function MobileBottomNav() {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    loadRole();
  }, []);

  async function loadRole() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return;

    setRole(user.email === "admin@company.com" ? "admin" : "employee");
  }

  if (!role) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-blue-100 shadow-lg">
      <div className="flex justify-around py-2 text-xs font-medium text-blue-700">
        {role === "admin" ? (
          <>
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1 hover:text-blue-900"
            >
              <span className="text-lg">📊</span>
              <span>Dashboard</span>
            </Link>
             <Link href="/employees" className="flex flex-col items-center">
      <span className="text-lg">👥</span>
      <span>Employees</span>
    </Link>

            <Link
              href="/dashboard/attendance"
              className="flex flex-col items-center gap-1 hover:text-blue-900"
            >
              <span className="text-lg">📋</span>
              <span>Attendance</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/attendance"
              className="flex flex-col items-center gap-1 hover:text-blue-900"
            >
              <span className="text-lg">🕒</span>
              <span>Punch</span>
            </Link>

            <Link
              href="/employee/attendance"
              className="flex flex-col items-center gap-1 hover:text-blue-900"
            >
              <span className="text-lg">📄</span>
              <span>History</span>
            </Link>

            <Link
              href="/employee/profile"
              className="flex flex-col items-center gap-1 hover:text-blue-900"
            >
              <span className="text-lg">👤</span>
              <span>Profile</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
