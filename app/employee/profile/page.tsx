"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MobileBottomNav from "@/app/components/MobileBottomNav";

type Employee = {
  employee_id: string;
  name: string;
  email: string;
  department: string;
  role: string;
};

export default function EmployeeProfilePage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);

    // 1️⃣ Get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    // 2️⃣ Fetch employee data using auth_user_id
    const { data, error } = await supabase
      .from("employees")
      .select("employee_id, name, email, department, role")
      .eq("auth_user_id", user.id)
      .single();

    if (error) {
      console.error(error);
      setError("Failed to load profile");
    } else {
      setEmployee(data);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 pb-24">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-700 text-center">
          My Profile
        </h1>

        {loading && (
          <p className="text-center text-gray-500">Loading profile…</p>
        )}

        {error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {employee && (
          <div className="space-y-3 text-sm">
            <ProfileRow label="Employee ID" value={employee.employee_id} />
            <ProfileRow label="Name" value={employee.name} />
            <ProfileRow label="Email" value={employee.email} />
            <ProfileRow label="Department" value={employee.department} />
            <ProfileRow label="Role" value={employee.role} />
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
}

/* ---------- SMALL HELPER COMPONENT ---------- */
function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
