"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import StatCard from "../components/StatCard";

export default function DashboardPage() {
  const router = useRouter();

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);

  useEffect(() => {
    checkRoleAndLoad();
  }, []);

  async function checkRoleAndLoad() {
    // 1️⃣ Get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    // 2️⃣ Get role from profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // 3️⃣ Role-based routing
    if (profile?.role !== "admin") {
      router.replace("/employee");
      return;
    }

    // 4️⃣ Load admin stats
    loadStats();
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

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={String(totalEmployees)} />
        <StatCard title="Present Today" value={String(presentToday)} />
        <StatCard title="Absent Today" value={String(absentToday)} />
        <StatCard title="Late Entries" value="--" />
      </div>
    </>
  );
}
 