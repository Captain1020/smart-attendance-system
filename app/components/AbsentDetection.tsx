"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Employee = {
  employee_id: string;
  name: string;
};

export default function AbsentDetection() {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [absentEmployees, setAbsentEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    findAbsentEmployees();
  }, [date]);

  async function findAbsentEmployees() {
    setLoading(true);

    // 1️⃣ Get all employees
    const { data: employees, error: empError } = await supabase
      .from("employees")
      .select("employee_id, name");

    if (empError) {
      alert(empError.message);
      setLoading(false);
      return;
    }

    // 2️⃣ Get attendance for selected date
    const { data: attendance, error: attError } = await supabase
      .from("attendance")
      .select("employee_id")
      .eq("date", date);

    if (attError) {
      alert(attError.message);
      setLoading(false);
      return;
    }

    const presentIds = new Set(
      (attendance || []).map((a) => a.employee_id)
    );

    // 3️⃣ Filter absent employees
    const absent = (employees || []).filter(
      (emp) => !presentIds.has(emp.employee_id)
    );

    setAbsentEmployees(absent);
    setLoading(false);
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">
        Absent Employees
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
        <p>Checking absentees...</p>
      ) : absentEmployees.length === 0 ? (
        <p>🎉 No absentees for this date.</p>
      ) : (
        <div className="space-y-2">
          {absentEmployees.map((emp) => (
            <div
              key={emp.employee_id}
              className="border p-3 rounded"
            >
              <p className="font-medium">{emp.name}</p>
              <p className="text-sm text-gray-600">
                Employee ID: {emp.employee_id}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
