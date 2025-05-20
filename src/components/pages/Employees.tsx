import React, { useEffect, useState } from "react";
import axios from "axios";

// Employees for selection (departments)
const departmentsList = [
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
  { value: "it", label: "IT" },
  { value: "operations", label: "Operations" },
];

const Employees = ({ letterData, setLetterData }) => {
  const [filteredDepartments, setFilteredDepartments] =
    useState(departmentsList);
  const [searchEmployees, setSearchEmployees] = useState(""); // State to store employee search query
  const [employeesByDepartment, setEmployeesByDepartment] = useState({}); // { department: [employeeName, ...] }
  const [loading, setLoading] = useState(false);

  // Fetch employees from the backend grouped by department
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        // Example endpoint: /api/users
        const res = await axios.get("http://localhost:5000/api/users");
        // Group employees by departmentOrSector
        const grouped = {};
        res.data.forEach((user) => {
          const dept = user.departmentOrSector?.toLowerCase() || "other";
          if (!grouped[dept]) grouped[dept] = [];
          grouped[dept].push(user.name);
        });
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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sector /Department
      </label>
      <input
        type="text"
        placeholder="Search Department..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
        onChange={(e) => {
          const search = e.target.value.toLowerCase();
          setFilteredDepartments(
            departmentsList.filter((d) =>
              d.label.toLowerCase().includes(search)
            )
          );
        }}
      />
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded-md">
        {filteredDepartments.map((department) => (
          <label
            key={department.value}
            className="inline-flex items-center space-x-2"
          >
            <input
              type="checkbox"
              checked={letterData.cc.includes(department.value)}
              onChange={(e) => {
                const updatedCC = e.target.checked
                  ? [...letterData.cc, department.value]
                  : letterData.cc.filter((v) => v !== department.value);
                setLetterData({ ...letterData, cc: updatedCC });
              }}
            />
            <span>{department.label}</span>
          </label>
        ))}
      </div>
      {letterData.cc.length > 0 && (
        <div className="mt-3">
          <span className="text-sm text-gray-600">Selected departments:</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {letterData.cc.map((ccVal) => {
              const department = departmentsList.find((d) => d.value === ccVal);
              return (
                <span
                  key={ccVal}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                >
                  {department?.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
      {/* Employees under selected departments */}
      {letterData.cc.map((departmentVal) => (
        <div key={departmentVal} className="mt-4 border-t pt-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">
            {departmentsList.find((d) => d.value === departmentVal)?.label}{" "}
            Employees
          </h4>

          {/* Employee search input */}
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
            onChange={(e) => setSearchEmployees(e.target.value.toLowerCase())}
          />

          {/* Show employees only if search input is not empty */}
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

          {/* Show selected employees under each department */}
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
