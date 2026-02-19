"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [generatedEmployeeId, setGeneratedEmployeeId] = useState("");

  async function generateEmployeeId() {
    const { data } = await supabase
      .from("employees")
      .select("employee_id")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!data?.employee_id) return "EMP001";

    const last = parseInt(data.employee_id.replace("EMP", ""), 10);
    return `EMP${String(last + 1).padStart(3, "0")}`;
  }

  async function handleRegister() {
    if (!name || !email || !password || !department) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    const { data: authData, error: authError } =
      await supabase.auth.signUp({ email, password });

    if (authError || !authData.user) {
      setLoading(false);
      alert(authError?.message || "Registration failed");
      return;
    }

    const employeeId = await generateEmployeeId();

    const { error: empError } = await supabase.from("employees").insert({
      employee_id: employeeId,
      name,
      email,
      department,
      role: "employee",
      auth_user_id: authData.user.id,
    });

    setLoading(false);

    if (empError) {
      alert("Employee creation failed");
      return;
    }

    setGeneratedEmployeeId(employeeId);
    setSuccess(true);
  }

  /* ---------- SUCCESS SCREEN ---------- */
  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-3">
            Registration Successful 🎉
          </h1>

          <p className="text-gray-700 mb-2">Your Employee ID</p>

          <p className="text-xl font-mono font-bold text-gray-900 mb-6">
            {generatedEmployeeId}
          </p>

          <p className="text-sm text-gray-600 mb-6">
            Please contact the admin to register your face before marking
            attendance.
          </p>

          <button
            onClick={() => router.replace("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  /* ---------- REGISTER FORM ---------- */
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Employee Registration
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>
      </div>
    </main>
  );
}
