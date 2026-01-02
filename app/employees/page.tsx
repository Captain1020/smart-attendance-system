import EmployeeForm from "@/app/components/EmployeeForm";
import EmployeeList from "@/app/components/EmployeeList";

export default function EmployeesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Employees</h1>

      <EmployeeForm />
      <EmployeeList />
    </div>
  );
}
