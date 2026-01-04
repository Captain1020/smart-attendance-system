"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import FaceCapture from "@/app/components/FaceCapture";

/* ---------- CONFIG ---------- */
const CAMPUS_LAT = 11.513944566899058;
const CAMPUS_LNG = 77.24670983047233;
const ALLOWED_RADIUS = 2000; // meters (dev-friendly)

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
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function faceDistance(a: number[], b: number[]) {
  return Math.sqrt(
    a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
  );
}

/* ---------- COMPONENT ---------- */
export default function Attendance() {
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFace, setShowFace] = useState(false);

  async function startPunchIn() {
    if (!employeeId) {
      alert("Enter Employee ID");
      return;
    }

    if (!navigator.geolocation) {
      alert("GPS not supported");
      return;
    }

    setLoading(true);

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
          alert("❌ You are outside the campus location");
          setLoading(false);
          return;
        }

        // GPS passed → now require face
        setShowFace(true);
        setLoading(false);
      },
      () => {
        alert("Location permission denied");
        setLoading(false);
      }
    );
  }

  async function handleFaceVerified(liveDescriptor: number[]) {
    setLoading(true);

    /* 1️⃣ Fetch employee + stored face */
    const { data: employee, error } = await supabase
      .from("employees")
      .select("id, face_descriptor")
      .eq("employee_id", employeeId)
      .single();

    if (error || !employee?.face_descriptor) {
      alert("❌ Employee face not registered");
      setLoading(false);
      return;
    }

    /* 2️⃣ Compare face */
    const distance = faceDistance(
      liveDescriptor,
      employee.face_descriptor
    );

    if (distance > 0.6) {
      alert("❌ Face mismatch. Attendance denied");
      setLoading(false);
      return;
    }

    /* 3️⃣ Mark attendance */
    const today = new Date().toISOString().split("T")[0];

    const { data: existing } = await supabase
      .from("attendance")
      .select("id")
      .eq("employee_id", employeeId)
      .eq("date", today)
      .single();

    if (existing) {
      alert("⚠️ Attendance already marked today");
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
      alert(insertError.message);
    } else {
      alert("✅ Attendance marked successfully");
    }

    // reset
    setEmployeeId("");
    setShowFace(false);
    setLoading(false);
  }

  return (
    <div className="border p-4 rounded mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Attendance Punch (GPS + Face)
      </h2>

      {!showFace && (
        <>
          <input
            className="border p-2 w-full mb-3"
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />

          <button
            onClick={startPunchIn}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Checking..." : "Punch In"}
          </button>
        </>
      )}

      {showFace && (
        <>
          <p className="mb-2 text-sm text-gray-600">
            Verify face to complete attendance
          </p>
          <FaceCapture onCapture={handleFaceVerified} />
        </>
      )}
    </div>
  );
}
