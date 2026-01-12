"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import FaceCapture from "@/app/components/FaceCapture";

/* ---------- CONFIG ---------- */
const CAMPUS_LAT = 11.513944566899058;
const CAMPUS_LNG = 77.24670983047233;
const ALLOWED_RADIUS = 2000;

/* ---------- HELPERS ---------- */
function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function faceDistance(a: number[], b: number[]) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

/* ---------- COMPONENT ---------- */
type AttendanceProps = {
  disabled?: boolean;
};

export default function Attendance({ disabled = false }: AttendanceProps) {
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [storedFace, setStoredFace] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFace, setShowFace] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  /* ✅ Load logged‑in employee once */
  useEffect(() => {
    init();
  }, []);

  async function init() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      setStatus("❌ Not logged in");
      return;
    }

    const { data: employee, error } = await supabase
      .from("employees")
      .select("employee_id, face_descriptor")
      .eq("email", user.email)
      .single();

    if (error || !employee) {
      setStatus("❌ Employee record not found");
      return;
    }

    setEmployeeId(employee.employee_id);
    setStoredFace(employee.face_descriptor);

    if (
      !Array.isArray(employee.face_descriptor) ||
      employee.face_descriptor.length === 0
    ) {
      setStatus(
        "⚠️ Face not registered. Please contact admin before punching attendance."
      );
    }
  }

  /* ---------- Punch In ---------- */
  async function startPunchIn() {
    if (disabled) {
  setStatus("⚠️ Face not registered. Contact admin.");
  return;
}
    if (!employeeId) return;

    if (!storedFace) {
      setStatus("⚠️ Face not registered. Attendance blocked.");
      return;
    }

    if (!navigator.geolocation) {
      setStatus("❌ GPS not supported");
      return;
    }

    setLoading(true);
    setStatus("📍 Checking location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const d = getDistanceInMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          CAMPUS_LAT,
          CAMPUS_LNG
        );

        if (d > ALLOWED_RADIUS) {
          setStatus("❌ Outside campus");
          setLoading(false);
          return;
        }

        setShowFace(true);
        setStatus("✅ Location verified. Verify face");
        setLoading(false);
      },
      () => {
        setStatus("❌ Location permission denied");
        setLoading(false);
      }
    );
  }

  /* ---------- Face Verify ---------- */
  async function handleFaceVerified(live: number[]) {
    if (!storedFace || !employeeId) return;

    setLoading(true);
    setStatus("🔍 Verifying face...");

    if (faceDistance(live, storedFace) > 0.6) {
      setStatus("❌ Face mismatch");
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const { data: existing } = await supabase
      .from("attendance")
      .select("id")
      .eq("employee_id", employeeId)
      .eq("date", today)
      .single();

    if (existing) {
      setStatus("⚠️ Attendance already marked today");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("attendance").insert({
      employee_id: employeeId,
      date: today,
      punch_in: new Date().toISOString(),
    });

    setStatus(error ? error.message : "✅ Attendance marked successfully");
    setShowFace(false);
    setLoading(false);
  }

  /* ---------- UI ---------- */
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">Attendance Punch</h2>

      {status && (
        <div className="text-center text-sm bg-gray-100 p-3 rounded">
          {status}
        </div>
      )}

      {!showFace && (
        <button
  onClick={startPunchIn}
  disabled={loading || disabled}
  className={`w-full py-3 text-lg rounded-lg text-white ${
    disabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
  }`}
>

          {loading ? "Checking..." : "Punch In"}
        </button>
      )}

      {showFace && <FaceCapture onCapture={handleFaceVerified} />}
    </div>
  );
}
