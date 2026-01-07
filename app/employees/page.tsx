"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import EmployeeForm from "@/app/components/EmployeeForm";
import FaceRegister from "@/app/components/FaceRegister";

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
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

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

  async function handleFaceRegistered(descriptor: number[]) {
    if (!selectedEmployee) return;

    await supabase
      .from("employees")
      .update({ face_descriptor: descriptor })
      .eq("id", selectedEmployee.id);

    setSelectedEmployee(null);
    loadEmployees();
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Employees</h2>

      {/* Add Employee */}
      <EmployeeForm onEmployeeAdded={loadEmployees} />

      {/* Face Register Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <FaceRegister
              employee={selectedEmployee}
              onSuccess={handleFaceRegistered}
              onClose={() => setSelectedEmployee(null)}
            />
          </div>
        </div>
      )}

      {/* Employee Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Employee ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Face</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && employees.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
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
                <td className="p-3">
                  <button
                    onClick={() => setSelectedEmployee(emp)}
                    className="bg-black text-white px-3 py-1 rounded"
                  >
                    Register Face
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
