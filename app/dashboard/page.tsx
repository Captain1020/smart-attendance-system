"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import MobileBottomNav from "@/app/components/MobileBottomNav";

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow border p-5">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);
  const [lateToday, setLateToday] = useState(0);
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

    const { count: lateCount } = await supabase
      .from("attendance")
      .select("*", { count: "exact", head: true })
      .eq("date", today)
      .eq("status", "late");

    setTotalEmployees(empCount || 0);
    setPresentToday(presentCount || 0);
    setLateToday(lateCount || 0);
    setAbsentToday((empCount || 0) - (presentCount || 0));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 py-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* HEADER */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h1 className="text-2xl font-bold text-blue-700">
              Admin Dashboard
            </h1>
            <p className="text-gray-700 mt-1 text-sm">
              Today’s attendance overview
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Employees"
              value={String(totalEmployees)}
              color="text-gray-900"
            />
            <StatCard
              title="Present Today"
              value={String(presentToday)}
              color="text-green-600"
            />
            <StatCard
              title="Late Entries"
              value={String(lateToday)}
              color="text-yellow-600"
            />
            <StatCard
              title="Absent Today"
              value={String(absentToday)}
              color="text-red-600"
            />
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
}
