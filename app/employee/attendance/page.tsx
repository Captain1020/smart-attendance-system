"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Attendance = {
  id: number;
  date: string;
  status: string | null;
};

export default function EmployeeAttendancePage() {
  const router = useRouter();
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [faceRegistered, setFaceRegistered] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);

    // 1️⃣ Get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      router.replace("/login");
      return;
    }

    // ❌ Admin blocked
    if (user.email === "admin@company.com") {
      router.replace("/dashboard");
      return;
    }

    // 2️⃣ Fetch employee + face info
    const { data: employee, error: empError } = await supabase
      .from("employees")
      .select("employee_id, face_descriptor")
      .eq("email", user.email)
      .single();

    if (empError || !employee) {
      router.replace("/login");
      return;
    }

    // ✅ Check face registration
    setFaceRegistered(
      Array.isArray(employee.face_descriptor) &&
        employee.face_descriptor.length > 0
    );

    // 3️⃣ Fetch attendance records
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
      <h2 className="text-2xl font-semibold mb-4">My Attendance</h2>

      {!faceRegistered && !loading && (
        <div className="mb-4 rounded-lg bg-yellow-100 border border-yellow-300 p-4 text-yellow-800">
          ⚠️ <strong>Face not registered.</strong> Please contact admin to
          complete face registration before punching attendance.
        </div>
      )}

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
                <td className="p-3">{r.status ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
