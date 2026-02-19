"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <aside className="w-64 bg-black text-white min-h-screen p-6 flex flex-col">
      <h1 className="text-xl font-bold mb-8">
        Smart Attendance
      </h1>

      <nav className="space-y-3 text-sm flex-1">
        {/* ADMIN */}
        <p className="text-gray-400 uppercase text-xs mt-4">Admin</p>

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
                     
                      Register
           </Link>
        

        {/* EMPLOYEE
        <p className="text-gray-400 uppercase text-xs mt-6">Employee</p>

        <Link href="/employee/attendance" className="block hover:text-gray-300">
          My Attendance
        </Link>

        <Link href="/employee/profile" className="block hover:text-gray-300">
          My Profile
        </Link> */}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold"
      >
        Logout
      </button>
    </aside>
  );
}
