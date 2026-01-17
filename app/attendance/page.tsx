"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import FaceCapture from "@/app/components/FaceCapture";
import MobileBottomNav from "@/app/components/MobileBottomNav";

/* ---------- TYPES ---------- */
type AttendanceProps = {
  disabled?: boolean;
};

/* ---------- CONFIG ---------- */
const CAMPUS_LAT = 11.513944566899058;
const CAMPUS_LNG = 77.24670983047233;
const ALLOWED_RADIUS = 2000; // meters

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
  return Math.sqrt(
    a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
  );
}

/* ---------- COMPONENT ---------- */
export default function Attendance({ disabled = false }: AttendanceProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFace, setShowFace] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function startPunchIn() {
    if (disabled) return;

    if (!employeeId) {
      setStatus("❗ Please enter your Employee ID");
      return;
    }

    if (!navigator.geolocation) {
      setStatus("❌ GPS not supported on this device");
      return;
    }

    setLoading(true);
    setStatus("📍 Verifying campus location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        const distance = getDistanceInMeters(
          latitude,
          longitude,
          CAMPUS_LAT,
          CAMPUS_LNG
        );

        if (distance > ALLOWED_RADIUS) {
          setStatus("❌ You are outside the allowed campus area");
          setLoading(false);
          return;
        }

        setStatus("✅ Location verified. Please verify your face");
        setShowFace(true);
        setLoading(false);
      },
      () => {
        setStatus("❌ Location permission denied");
        setLoading(false);
      }
    );
  }

  async function handleFaceVerified(liveDescriptor: number[]) {
    setLoading(true);
    setStatus("🔍 Verifying face...");

    const { data: employee, error } = await supabase
      .from("employees")
      .select("id, face_descriptor")
      .eq("employee_id", employeeId)
      .single();

    if (error || !employee?.face_descriptor) {
      setStatus("❌ Face not registered for this employee");
      setLoading(false);
      return;
    }

    const distance = faceDistance(
      liveDescriptor,
      employee.face_descriptor
    );

    if (distance > 0.6) {
      setStatus("❌ Face mismatch. Attendance denied");
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

    const { error: insertError } = await supabase
      .from("attendance")
      .insert({
        employee_id: employeeId,
        date: today,
        punch_in: new Date().toISOString(),
      });

    if (insertError) {
      setStatus(insertError.message);
    } else {
      setStatus("✅ Attendance marked successfully");
    }

    setEmployeeId("");
    setShowFace(false);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 pb-20">
      {/* CENTER CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-700">
          Attendance Punch
        </h2>

        {status && (
          <div className="text-center text-sm bg-blue-100 text-blue-900 p-3 rounded-lg">
            {status}
          </div>
        )}

        {!showFace && (
          <div className="space-y-4">
            <input
              className="w-full rounded-lg border border-blue-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Employee ID"
              value={employeeId}
              disabled={disabled}
              onChange={(e) => setEmployeeId(e.target.value)}
            />

            <button
              onClick={startPunchIn}
              disabled={loading || disabled}
              className={`w-full py-3 rounded-lg text-lg font-semibold transition ${
                disabled
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {disabled
                ? "Face Not Registered"
                : loading
                ? "Checking..."
                : "Punch In"}
            </button>
          </div>
        )}

        {showFace && (
          <div className="space-y-3">
            <p className="text-sm text-center text-gray-600">
              Step 2: Face Verification
            </p>
            <FaceCapture onCapture={handleFaceVerified} />
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAV */}
      <MobileBottomNav />
    </div>
  );
}
