"use client";

import Attendance from "@/app/components/Attendance";

export default function AttendancePage() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Attendance</h2>

      <div className="bg-white p-6 rounded shadow max-w-xl">
        <Attendance />
      </div>
    </>
  );
}


