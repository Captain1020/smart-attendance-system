"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MobileBottomNav from "@/app/components/MobileBottomNav";

type Row = {
  id: number;
  date: string;
  status: string;
  employee_id: string;
};

export default function AdminAttendancePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data, error } = await supabase
      .from("attendance")
      .select("id, date, status, employee_id")
      .order("date", { ascending: false });

    if (!error) setRows(data || []);
    setLoading(false);
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 py-6 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance History
          </h1>
          <p className="text-gray-600 mt-1">
            View all employee attendance records
          </p>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow border overflow-hidden">
          {loading && (
            <div className="p-6 text-center text-gray-500">
              Loading attendance records…
            </div>
          )}

          {!loading && rows.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No attendance records found
            </div>
          )}

          {!loading && rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 text-blue-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Employee ID</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">{r.date}</td>
                      <td className="px-4 py-3 font-medium">
                        {r.employee_id}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            r.status === "present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {r.status}
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

      {/* Mobile Navigation */}
      <MobileBottomNav />
    </>
  );
}
