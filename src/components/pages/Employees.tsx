import React, { useEffect, useState } from "react";
import axios from "axios";
import DepartmentSelector from "./DepartmentSelector";

interface CCLetterData {
  cc: string[];
  ccEmployees: Record<string, string[]>;
}

interface EmployeesProps {
  letterData: CCLetterData;
  setLetterData: React.Dispatch<React.SetStateAction<CCLetterData>>;
}

const Employees: React.FC<EmployeesProps> = ({ letterData, setLetterData }) => {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [searchEmployees, setSearchEmployees] = useState<string>("");
  const [employeesByDepartment, setEmployeesByDepartment] = useState<
    Record<string, string[]>
  >({});
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch employees from the backend grouped by department
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        const grouped: Record<string, string[]> = {};
        res.data.forEach(
          (user: { departmentOrSector: string; name: string }) => {
            const dept = user.departmentOrSector?.toLowerCase() || "other";
            if (!grouped[dept]) grouped[dept] = [];
            grouped[dept].push(user.name);
          }
        );
        setEmployeesByDepartment(grouped);
      } catch (err) {
        setEmployeesByDepartment({});
      }
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">CC</label>
      <DepartmentSelector
        onChange={(value: string) => {
          if (!selectedDepartments.includes(value)) {
            setSelectedDepartments([...selectedDepartments, value]);
            setLetterData({
              ...letterData,
              cc: [...letterData.cc, value],
            });
          }
        }}
      />

      {selectedDepartments.length > 0 && (
        <div className="mt-3">
          <span className="text-sm text-gray-600">Selected departments:</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {selectedDepartments.map((dept) => (
              <span
                key={dept}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>
      )}

      {selectedDepartments.map((departmentVal) => (
        <div key={departmentVal} className="mt-4 border-t pt-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">
            {departmentVal} Employees
          </h4>

          <input
            type="text"
            placeholder="Search employees..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
            onChange={(e) => setSearchEmployees(e.target.value.toLowerCase())}
          />

          {loading ? (
            <div className="text-gray-500 text-sm">Loading employees...</div>
          ) : (
            searchEmployees && (
              <div className="grid grid-cols-2 gap-2">
                {(employeesByDepartment[departmentVal] || [])
                  .filter((emp) => emp.toLowerCase().includes(searchEmployees))
                  .map((emp) => (
                    <label
                      key={emp}
                      className="inline-flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={letterData.ccEmployees[
                          departmentVal
                        ]?.includes(emp)}
                        onChange={(e) => {
                          const updatedEmployees = e.target.checked
                            ? [
                                ...(letterData.ccEmployees[departmentVal] ||
                                  []),
                                emp,
                              ]
                            : letterData.ccEmployees[departmentVal].filter(
                                (x) => x !== emp
                              );
                          setLetterData({
                            ...letterData,
                            ccEmployees: {
                              ...letterData.ccEmployees,
                              [departmentVal]: updatedEmployees,
                            },
                          });
                        }}
                      />
                      <span>{emp}</span>
                    </label>
                  ))}
              </div>
            )
          )}

          {letterData.ccEmployees[departmentVal]?.length > 0 && (
            <div className="mt-2">
              <span className="text-sm text-gray-600">Selected Employees:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {letterData.ccEmployees[departmentVal].map((emp) => (
                  <span
                    key={emp}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                  >
                    {emp}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Employees;
