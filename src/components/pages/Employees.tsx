import React from 'react';

// Employees for selection (now using Employees instead of departments)
const employeesList = [
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'it', label: 'IT' },
  { value: 'operations', label: 'Operations' }
];

// Employees mapped to categories
const employeesByCategory = {
  finance: ['Alice', 'Bob'],
  hr: ['Carol', 'David'],
  it: ['Eve', 'Frank'],
  operations: ['Grace', 'Heidi']
};

const Employees = ({ letterData, setLetterData }) => {
  const [filteredEmployees, setFilteredEmployees] = React.useState(employeesList);
  const [searchEmployees, setSearchEmployees] = React.useState(''); // State to store employee search query

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Employees</label>
      <input
        type="text"
        placeholder="Search Employees..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
        onChange={(e) => {
          const search = e.target.value.toLowerCase();
          setFilteredEmployees(
            employeesList.filter((e) => e.label.toLowerCase().includes(search))
          );
        }}
      />
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded-md">
        {filteredEmployees.map((employee) => (
          <label key={employee.value} className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={letterData.cc.includes(employee.value)}
              onChange={(e) => {
                const updatedCC = e.target.checked
                  ? [...letterData.cc, employee.value]
                  : letterData.cc.filter((e) => e !== employee.value);
                setLetterData({ ...letterData, cc: updatedCC });
              }}
            />
            <span>{employee.label}</span>
          </label>
        ))}
      </div>
      {letterData.cc.length > 0 && (
        <div className="mt-3">
          <span className="text-sm text-gray-600">Selected Employees:</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {letterData.cc.map((ccVal) => {
              const employee = employeesList.find((e) => e.value === ccVal);
              return (
                <span key={ccVal} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                  {employee?.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
      {/* Employees under selected categories */}
      {letterData.cc.map((categoryVal) => (
        <div key={categoryVal} className="mt-4 border-t pt-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">{employeesList.find(e => e.value === categoryVal)?.label} Employees</h4>
          
          {/* Employee search input */}
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
            onChange={(e) => setSearchEmployees(e.target.value.toLowerCase())} // Update search query
          />
          
          {/* Show employees only if search input is not empty */}
          {searchEmployees && (
            <div className="grid grid-cols-2 gap-2">
              {employeesByCategory[categoryVal]
                .filter((emp) => emp.toLowerCase().includes(searchEmployees)) // Filter employees based on search query
                .map((emp) => (
                  <label key={emp} className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={letterData.ccEmployees[categoryVal]?.includes(emp)}
                      onChange={(e) => {
                        const updatedEmployees = e.target.checked
                          ? [...(letterData.ccEmployees[categoryVal] || []), emp]
                          : letterData.ccEmployees[categoryVal].filter((e) => e !== emp);
                        setLetterData({
                          ...letterData,
                          ccEmployees: {
                            ...letterData.ccEmployees,
                            [categoryVal]: updatedEmployees,
                          },
                        });
                      }}
                    />
                    <span>{emp}</span>
                  </label>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Employees;
