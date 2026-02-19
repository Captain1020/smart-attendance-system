"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AttendanceRecord = {
  employee_id: string;
  punch_in: string | null;
  punch_out: string | null;
};

export default function AttendanceHistory() {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [date]);

  async function fetchHistory() {
    setLoading(true);

    const { data, error } = await supabase
      .from("attendance")
      .select("employee_id, punch_in, punch_out")
      .eq("date", date)
      .order("employee_id");

    if (error) {
      alert(error.message);
    } else {
      setRecords(data || []);
    }

    setLoading(false);
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">
        Attendance History
      </h2>

      <div className="mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : records.length === 0 ? (
        <p>No attendance found for this date.</p>
      ) : (
        <div className="space-y-2">
          {records.map((rec, index) => (
            <div
              key={index}
              className="border p-3 rounded"
            >
              <p className="font-medium">
                Employee ID: {rec.employee_id}
              </p>
              <p className="text-sm text-gray-600">
                In: {rec.punch_in || "--"} | Out: {rec.punch_out || "--"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
