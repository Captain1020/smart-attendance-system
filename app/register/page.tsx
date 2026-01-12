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

  // ✅ NEW STATE
  const [success, setSuccess] = useState(false);
  const [generatedEmployeeId, setGeneratedEmployeeId] = useState("");

  async function generateEmployeeId() {
    const { data, error } = await supabase
      .from("employees")
      .select("employee_id")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data?.employee_id) {
      return "EMP001";
    }

    const lastNumber = parseInt(data.employee_id.replace("EMP", ""), 10);
    const nextNumber = lastNumber + 1;

    return `EMP${String(nextNumber).padStart(3, "0")}`;
  }

  async function handleRegister() {
    if (!name || !email || !password || !department) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    // 1️⃣ Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (authError || !authData.user) {
      setLoading(false);
      alert(authError?.message || "Auth failed");
      return;
    }

    // 2️⃣ Generate EMP ID
    const employeeId = await generateEmployeeId();

    // 3️⃣ Insert employee record
    const { error: empError } = await supabase
      .from("employees")
      .insert({
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

    // ✅ SUCCESS STATE
    setGeneratedEmployeeId(employeeId);
    setSuccess(true);
  }

  // ✅ SUCCESS SCREEN
  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-green-600">
            Registration Successful 🎉
          </h1>

          <p className="mb-3 text-gray-700">
            Your Employee ID:
          </p>

          <p className="text-xl font-mono font-semibold mb-6">
            {generatedEmployeeId}
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Please contact the admin to register your face before marking attendance.
          </p>

          <button
            onClick={() => router.replace("/login")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  // 🔹 REGISTRATION FORM
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Employee Registration
        </h1>

        <div className="space-y-4">
          <input
            placeholder="Full Name"
            className="w-full border rounded-lg px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Department"
            className="w-full border rounded-lg px-4 py-2"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>
      </div>
    </main>
  );
}
