"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

/* ================= CONFIG ================= */

// 🔁 Toggle this
const USE_MOCK_GPS = true; // ✅ true = DEV | false = REAL GPS

// 🎯 Campus coordinates
const CAMPUS_LAT = 11.513944566899058;
const CAMPUS_LNG = 77.24670983047233;

// 📏 Allowed radius (meters)
const ALLOWED_RADIUS = 2000; // keep large for DEV

/* ========================================== */

export default function Attendance() {
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);

  // TEMP: time window already tested earlier
  function getAttendanceStatus() {
    return "Present"; // change later for Late logic
  }

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

  async function handlePunchIn() {
    setLoading(true);

    const status = getAttendanceStatus();
    if (!status) {
      alert("❌ Attendance time window closed");
      setLoading(false);
      return;
    }

    let latitude: number;
    let longitude: number;

    /* ========= GPS FETCH ========= */

    if (USE_MOCK_GPS) {
      // ✅ MOCK GPS (DEV MODE)
      latitude = CAMPUS_LAT;
      longitude = CAMPUS_LNG;
    } else {
      // ✅ REAL GPS (PROD)
      if (!navigator.geolocation) {
        alert("❌ GPS not supported");
        setLoading(false);
        return;
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    }

    /* ========= DISTANCE CHECK ========= */

    const distance = getDistanceInMeters(
      latitude,
      longitude,
      CAMPUS_LAT,
      CAMPUS_LNG
    );

    // 🔍 Debug popup (remove later)
    alert(
      `📍 GPS VERIFICATION\n\n` +
        `Latitude: ${latitude}\n` +
        `Longitude: ${longitude}\n\n` +
        `Distance: ${distance.toFixed(2)} meters`
    );

    if (distance > ALLOWED_RADIUS) {
      alert("❌ You are outside the campus location");
      setLoading(false);
      return;
    }

    /* ========= DB LOGIC ========= */

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

    const { error } = await supabase.from("attendance").insert({
      employee_id: employeeId,
      date: today,
      punch_in: new Date().toISOString(),
      status,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("✅ Attendance marked successfully");
      setEmployeeId("");
    }

    setLoading(false);
  }

  async function handlePunchOut() {
    setLoading(true);

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("attendance")
      .update({ punch_out: new Date().toISOString() })
      .eq("employee_id", employeeId)
      .eq("date", today);

    if (error) {
      alert(error.message);
    } else {
      alert("✅ Punch out recorded");
      setEmployeeId("");
    }

    setLoading(false);
  }

  return (
    <div className="border p-4 rounded mt-6 max-w-md">
      <h2 className="text-xl font-semibold mb-4">
        Attendance Punch (GPS Enabled)
      </h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={handlePunchIn}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Punch In
        </button>

        <button
          onClick={handlePunchOut}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Punch Out
        </button>
      </div>
    </div>
  );
}
