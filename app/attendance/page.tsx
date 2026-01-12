"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Attendance from "@/app/components/Attendance";

export default function AttendancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [faceRegistered, setFaceRegistered] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      router.replace("/login");
      return;
    }

    if (user.email === "admin@company.com") {
      router.replace("/dashboard");
      return;
    }

    const { data: employee, error } = await supabase
      .from("employees")
      .select("face_descriptor")
      .eq("email", user.email)
      .single();

    if (error || !employee) {
      router.replace("/login");
      return;
    }

    setFaceRegistered(
      Array.isArray(employee.face_descriptor) &&
        employee.face_descriptor.length > 0
    );

    setLoading(false);
  }

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-center mb-4">
        Attendance
      </h2>

      {!faceRegistered && (
        <div className="mb-4 max-w-md mx-auto rounded-lg bg-yellow-100 border border-yellow-300 p-4 text-yellow-800">
          ⚠️ <strong>Face not registered.</strong>
          <br />
          Please contact admin before punching attendance.
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-lg max-w-md mx-auto">
        <Attendance disabled={!faceRegistered} />
      </div>
    </div>
  );
}
