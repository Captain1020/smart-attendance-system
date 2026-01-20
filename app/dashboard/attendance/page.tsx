"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AttendanceRow = {
  id: number;
  date: string;
  status: string | null;
  punch_in: string | null;
  employee_id: string;
  employeeName?: string;
};

export default function AdminAttendancePage() {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    setLoading(true);

    // 1️⃣ Get attendance records
    const { data: attendance, error } = await supabase
      .from("attendance")
      .select("id, date, status, punch_in, employee_id")
      .order("date", { ascending: false });

    if (error) {
      console.error("Attendance error:", error);
      setRows([]);
      setLoading(false);
      return;
    }

    if (!attendance || attendance.length === 0) {
      setRows([]);
      setLoading(false);
      return;
    }

    // 2️⃣ Get employees
    const { data: employees } = await supabase
      .from("employees")
      .select("employee_id, name");

    // 3️⃣ Merge attendance + employee name
    const merged = attendance.map((a) => ({
      ...a,
      employeeName:
        employees?.find((e) => e.employee_id === a.employee_id)?.name ||
        "Unknown",
    }));

    setRows(merged);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Attendance History</h1>

        {loading && <p className="text-gray-500">Loading…</p>}

        {!loading && rows.length === 0 && (
          <p className="text-gray-500">No attendance records found</p>
        )}

        {!loading && rows.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-xl shadow border">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 text-blue-800">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">Punch In</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">{r.date}</td>
                    <td className="p-3 font-medium">
                      {r.employeeName} ({r.employee_id})
                    </td>
                    <td className="p-3">
                      {r.punch_in
                        ? new Date(r.punch_in).toLocaleTimeString()
                        : "-"}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                        Present
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
