"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

    if (error) {
      console.error(error);
    } else {
      setRows(data || []);
    }

    setLoading(false);
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">
        Attendance History (Admin)
      </h2>

      {loading && <p>Loading...</p>}

      {!loading && rows.length === 0 && (
        <p>No attendance records</p>
      )}

      {!loading && rows.length > 0 && (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Employee ID</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.date}</td>
                <td className="p-3">{r.employee_id}</td>
                <td className="p-3">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
