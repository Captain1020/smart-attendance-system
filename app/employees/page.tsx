"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import EmployeeForm from "@/app/components/EmployeeForm";

type Employee = {
  id: number;
  employee_id: string;
  name: string;
  department: string;
  face_descriptor: number[] | null;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    setLoading(true);

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setEmployees(data);
    }

    setLoading(false);
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Employees</h2>

      {/* Add Employee */}
      <EmployeeForm onEmployeeAdded={loadEmployees} />

      {/* Employee Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Employee ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Face Registered</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && employees.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No employees found
                </td>
              </tr>
            )}

            {employees.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="p-3">{emp.employee_id}</td>
                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.department}</td>
                <td className="p-3">
                  {emp.face_descriptor ? (
                    <span className="text-green-600 font-semibold">✅ Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
