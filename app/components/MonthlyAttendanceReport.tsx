"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ReportRow = {
  employee_id: string;
  presentDays: number;
};

export default function MonthlyAttendanceReport() {
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );
  const [report, setReport] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [month]);

  async function fetchReport() {
    setLoading(true);

    const startDate = `${month}-01`;
    const endDate = `${month}-31`;

    const { data, error } = await supabase
      .from("attendance")
      .select("employee_id, date")
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Count present days per employee
    const map: Record<string, number> = {};
    (data || []).forEach((row) => {
      map[row.employee_id] = (map[row.employee_id] || 0) + 1;
    });

    const result: ReportRow[] = Object.keys(map).map((key) => ({
      employee_id: key,
      presentDays: map[key],
    }));

    setReport(result);
    setLoading(false);
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">
        Monthly Attendance Report
      </h2>

      <div className="mb-4">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {loading ? (
        <p>Loading report...</p>
      ) : report.length === 0 ? (
        <p>No attendance data for this month.</p>
      ) : (
        <div className="space-y-2">
          {report.map((row) => (
            <div
              key={row.employee_id}
              className="border p-3 rounded flex justify-between"
            >
              <p className="font-medium">
                Employee ID: {row.employee_id}
              </p>
              <p className="font-semibold">
                Present Days: {row.presentDays}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
