"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import StatCard from "../components/StatCard";
import MobileBottomNav from "@/app/components/MobileBottomNav";

export default function DashboardPage() {
  const router = useRouter();

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  async function checkAdminAuth() {
    const user = await getCurrentUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isAdmin(user.email)) {
      router.replace("/employee/attendance");
      return;
    }

    await loadStats();
    setLoading(false);
  }

  async function loadStats() {
    const today = new Date().toISOString().split("T")[0];

    const { count: empCount } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true });

    const { count: presentCount } = await supabase
      .from("attendance")
      .select("*", { count: "exact", head: true })
      .eq("date", today);

    setTotalEmployees(empCount || 0);
    setPresentToday(presentCount || 0);
    setAbsentToday((empCount || 0) - (presentCount || 0));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <>
      {/* MAIN CONTAINER */}
      <div className="min-h-screen bg-gray-50 px-4 py-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* HEADER */}
          <div className="bg-white rounded-xl shadow p-5">
            <h1 className="text-2xl font-bold text-blue-700">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Today’s attendance overview
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Employees"
              value={String(totalEmployees)}
            />
            <StatCard
              title="Present Today"
              value={String(presentToday)}
            />
            <StatCard
              title="Absent Today"
              value={String(absentToday)}
            />
            <StatCard
              title="Late Entries"
              value="--"
            />
          </div>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <MobileBottomNav />
    </>
  );
}
