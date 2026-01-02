"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type EmployeeListProps = {
  refreshKey: number;
};

type Employee = {
  id: number;
  employee_id: string;
  name: string;
  department: string;
};

export default function EmployeeList({ refreshKey }: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching employees:", error.message);
    } else {
      setEmployees(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, [refreshKey]);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      alert("Employee deleted ✅");
      fetchEmployees();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Employee List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : employees.length === 0 ? (
        <div className="border p-4 rounded">
          <p>No employees yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{emp.name}</p>
                <p className="text-sm text-gray-600">
                  {emp.employee_id} — {emp.department}
                </p>
              </div>

              <button
                onClick={() => handleDelete(emp.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
