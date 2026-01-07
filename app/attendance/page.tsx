"use client";

import Attendance from "@/app/components/Attendance";

export default function AttendancePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-center mb-4">
        Attendance
      </h2>

      {/* Mobile Card */}
      <div className="bg-white p-4 rounded-xl shadow-lg max-w-md mx-auto">
        <Attendance />
      </div>
    </div>
  );
}
