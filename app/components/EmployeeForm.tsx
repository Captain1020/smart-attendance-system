"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EmployeeForm() {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("employees").insert([
      {
        employee_id: employeeId,
        name: name,
        department: department,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error adding employee: " + error.message);
    } else {
      alert("Employee added successfully ✅");
      setEmployeeId("");
      setName("");
      setDepartment("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <h2 className="text-xl font-semibold">Add Employee</h2>

      <input
        className="border p-2 w-full"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full"
        placeholder="Employee Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full"
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Add Employee"}
      </button>
    </form>
  );
}
