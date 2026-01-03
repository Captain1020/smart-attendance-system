"use client";

import { useState } from "react";
import EmployeeForm from "@/app/components/EmployeeForm";
import EmployeeList from "@/app/components/EmployeeList";
import Attendance from "@/app/components/Attendance";
import AttendanceHistory from "@/app/components/AttendanceHistory";
import MonthlyAttendanceReport from "@/app/components/MonthlyAttendanceReport";
import AbsentDetection from "@/app/components/AbsentDetection";




export default function EmployeesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEmployeeAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Employees</h1>

      <EmployeeForm onEmployeeAdded={handleEmployeeAdded} />
      <EmployeeList refreshKey={refreshKey} />
      <Attendance />
      <AttendanceHistory/>
      <MonthlyAttendanceReport />
      <AbsentDetection/>

    </div>
  );
}
