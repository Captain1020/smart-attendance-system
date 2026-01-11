"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Attendance = {
  id: number;
  date: string;
  status: string | null;
};

export default function EmployeeAttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    setLoading(true);

    // 1️⃣ Get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      setLoading(false);
      return;
    }
    console.log("AUTH USER EMAIL:", user.email);
        // 🚨 BLOCK ADMIN HERE
    if (user?.email === "admin@company.com") {
    alert("Admins cannot access employee attendance page");
    setLoading(false);
    return;
}
    

    // 2️⃣ Find employee_id using email
    const { data: employee, error: empError } = await supabase
      .from("employees")
      .select("employee_id")
      .eq("email", user.email)
      .single();

    if (empError || !employee) {
      console.error("Employee not found");
      setLoading(false);
      return;
    }

    // 3️⃣ Fetch only THIS employee’s attendance
    const { data, error } = await supabase
      .from("attendance")
      .select("id, date, status")
      .eq("employee_id", employee.employee_id)
      .order("date", { ascending: false });

    if (error) {
      console.error(error);
    }

    setRecords(data || []);
    setLoading(false);
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">My Attendance</h2>

      {loading && <p>Loading...</p>}

      {!loading && records.length === 0 && (
        <p className="text-gray-500">No attendance records found</p>
      )}

      {!loading && records.length > 0 && (
        <table className="w-full border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.date}</td>
                <td className="p-3">
                  {r.status ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
