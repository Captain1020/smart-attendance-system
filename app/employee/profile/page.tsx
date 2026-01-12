"use client";

export default function EmployeeProfilePage() {
  // 🔒 UI-only mock data (no backend, no Supabase)
  const profile = {
    name: "John Doe",
    employeeId: "EMP001",
    department: "Engineering",
    email: "employee1@company.com",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium">{profile.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="text-lg font-medium">{profile.employeeId}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="text-lg font-medium">{profile.department}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{profile.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
