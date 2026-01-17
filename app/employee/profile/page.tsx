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

    if (user.email === "admin@company.com") {
      setRole("admin");
    } else {
      setRole("employee");
    }
  }

  if (!role) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow md:hidden">
      <div className="flex justify-around py-2 text-xs font-medium text-gray-700">
        {role === "admin" ? (
          <>
            <Link href="/dashboard" className="flex flex-col items-center">
              📊
              <span>Dashboard</span>
            </Link>

            <Link href="/dashboard/attendance" className="flex flex-col items-center">
              📋
              <span>Attendance</span>
            </Link>

            <Link href="/dashboard/employees" className="flex flex-col items-center">
              👥
              <span>Employees</span>
            </Link>

            <Link href="/dashboard/employees/add" className="flex flex-col items-center">
              ➕
              <span>Add</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/attendance" className="flex flex-col items-center">
              🕒
              <span>Punch</span>
            </Link>

            <Link href="/employee/attendance" className="flex flex-col items-center">
              📄
              <span>History</span>
            </Link>

            <Link href="/employee/profile" className="flex flex-col items-center">
              👤
              <span>Profile</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
