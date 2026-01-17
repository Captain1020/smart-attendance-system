"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    setLoading(true);
    const { data } = await supabase
      .from("employees")
      .select("*")
      .order("id", { ascending: false });

    setEmployees(data || []);
    setLoading(false);
  }

  async function deleteEmployee(id: number) {
    if (!confirm("Delete this employee?")) return;
    await supabase.from("employees").delete().eq("id", id);
    loadEmployees();
  }

  async function saveEdit() {
    if (!editEmployee) return;

    await supabase
      .from("employees")
      .update({
        name: editEmployee.name,
        department: editEmployee.department,
      })
      .eq("id", editEmployee.id);

    setEditEmployee(null);
    loadEmployees();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employees</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-5 shadow">
          <p className="text-sm opacity-80">Total Employees</p>
          <p className="text-3xl font-bold mt-2">{employees.length}</p>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Department</th>
              <th className="p-4 text-left">Face</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-4">{e.employee_id}</td>
                <td className="p-4">{e.name}</td>
                <td className="p-4">{e.department}</td>
                <td className="p-4">
                  {e.face_descriptor ? (
                    <span className="text-green-600 font-semibold">✔ Registered</span>
                  ) : (
                    <span className="text-red-500 font-semibold">✖ Not Registered</span>
                  )}
                </td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => setEditEmployee(e)}
                    className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEmployee(e.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && employees.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No employees found
          </p>
        )}
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-4">
        {employees.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-xl shadow p-4 space-y-2"
          >
            <div className="flex justify-between">
              <p className="font-semibold">{e.name}</p>
              <span className="text-xs text-gray-500">{e.employee_id}</span>
            </div>

            <p className="text-sm text-gray-600">
              Dept: <strong>{e.department}</strong>
            </p>

            <p className="text-sm">
              Face:{" "}
              {e.face_descriptor ? (
                <span className="text-green-600 font-semibold">Registered</span>
              ) : (
                <span className="text-red-500 font-semibold">Not Registered</span>
              )}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditEmployee(e)}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteEmployee(e.id)}
                className="flex-1 bg-red-600 text-white py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">Edit Employee</h3>

            <input
              value={editEmployee.name}
              onChange={(e) =>
                setEditEmployee({ ...editEmployee, name: e.target.value })
              }
              className="w-full border p-2 rounded"
              placeholder="Name"
            />

            <input
              value={editEmployee.department}
              onChange={(e) =>
                setEditEmployee({
                  ...editEmployee,
                  department: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
              placeholder="Department"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditEmployee(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
