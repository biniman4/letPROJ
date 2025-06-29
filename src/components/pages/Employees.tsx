import React, { useState } from "react";
import DepartmentSelector from "./DepartmentSelector";
import { LetterData } from "../../types/letter.d";
import { useLetterForm } from "../../context/LetterFormContext";
import { useLanguage } from "./LanguageContext";

interface EmployeesProps {
  letterData: LetterData;
  setLetterData: React.Dispatch<React.SetStateAction<LetterData>>;
}

const Employees: React.FC<EmployeesProps> = ({ letterData, setLetterData }) => {
  const { users, loadingUsers, fetchUsers } = useLetterForm();
  const { t, lang } = useLanguage();
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [searchEmployees, setSearchEmployees] = useState<string>("");

  // Get department hierarchy from translations
  const departments = t.departmentSelector.departments;
  const subCategories =
    departments.find((dept: any) => dept.label === selectedMainCategory)
      ?.subDepartments || [];
  const subSubCategories =
    subCategories.find((sub: any) => sub.label === selectedSubCategory)
      ?.subDepartments || [];

  // Build the full path for the selected sub sub category
  const currentDepartment =
    selectedMainCategory && selectedSubCategory && selectedSubSubCategory
      ? `${selectedMainCategory} > ${selectedSubCategory} > ${selectedSubSubCategory}`
      : selectedMainCategory && selectedSubCategory
      ? `${selectedMainCategory} > ${selectedSubCategory}`
      : selectedMainCategory;

  // Group users by full department path (case-insensitive)
  const employeesByDepartment: Record<string, string[]> = React.useMemo(() => {
    const grouped: Record<string, string[]> = {};
    users.forEach((user: { departmentOrSector: string; name: string }) => {
      const dept = user.departmentOrSector?.trim().toLowerCase() || "other";
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push(user.name);
    });
    return grouped;
  }, [users]);

  // Filter users based on search term across all departments
  const filteredEmployees = React.useMemo(() => {
    if (!searchEmployees) return {};
    const filtered: Record<string, string[]> = {};
    Object.entries(employeesByDepartment).forEach(([dept, employees]) => {
      const matchingEmployees = employees.filter((emp) =>
        emp.toLowerCase().includes(searchEmployees.toLowerCase())
      );
      if (matchingEmployees.length > 0) {
        filtered[dept] = matchingEmployees;
      }
    });
    return filtered;
  }, [employeesByDepartment, searchEmployees]);

  // Get all users in the current department (case-insensitive)
  const allUsersInCurrentDepartment =
    employeesByDepartment[currentDepartment?.toLowerCase?.() || ""] || [];

  // Helper: Are all users in current department already selected?
  const allSelected =
    currentDepartment &&
    allUsersInCurrentDepartment.length > 0 &&
    (letterData.ccEmployees[currentDepartment]?.length || 0) ===
      allUsersInCurrentDepartment.length;

  // Handler: Select all users in current department
  const handleSelectAll = () => {
    if (!currentDepartment) return;
    setLetterData({
      ...letterData,
      ccEmployees: {
        ...letterData.ccEmployees,
        [currentDepartment]: allUsersInCurrentDepartment,
      },
    });
  };

  // Handler: Add department path to selectedDepartments and cc
  const handleDepartmentPath = (path: string) => {
    if (!selectedDepartments.includes(path)) {
      setSelectedDepartments([...selectedDepartments, path]);
      setLetterData({
        ...letterData,
        cc: [...letterData.cc, path],
      });
    }
  };

  const { fullySelectedDepts, individualRecipients } = React.useMemo(() => {
    const fully: string[] = [];
    const individual: Record<string, string[]> = {};

    for (const dept in letterData.ccEmployees) {
      const selectedEmps = letterData.ccEmployees[dept];
      if (!selectedEmps || selectedEmps.length === 0) continue;

      const allEmpsInDept = employeesByDepartment[dept.toLowerCase()] || [];

      if (
        allEmpsInDept.length > 0 &&
        selectedEmps.length === allEmpsInDept.length
      ) {
        fully.push(dept);
      } else {
        individual[dept] = selectedEmps;
      }
    }
    return { fullySelectedDepts: fully, individualRecipients: individual };
  }, [letterData.ccEmployees, employeesByDepartment]);

  // When sub sub category changes, update selectedDepartments/cc
  React.useEffect(() => {
    if (selectedMainCategory && selectedSubCategory && selectedSubSubCategory) {
      const path = `${selectedMainCategory} > ${selectedSubCategory} > ${selectedSubSubCategory}`;
      handleDepartmentPath(path);
    }
  }, [selectedMainCategory, selectedSubCategory, selectedSubSubCategory]);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {t.employees.ccLabel}
        </label>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {t.employees.confidential}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        {t.employees.ccDescription}
      </p>

      {/* Main Category Dropdown */}
      <label className="block text-gray-700 font-medium mb-1">
        {t.departmentSelector.mainCategory}
      </label>
      <select
        className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-200 mb-2"
        value={selectedMainCategory}
        onChange={(e) => {
          setSelectedMainCategory(e.target.value);
          setSelectedSubCategory("");
          setSelectedSubSubCategory("");
        }}
      >
        <option value="">{t.departmentSelector.selectMainCategory}</option>
        {departments.map((dept: any) => (
          <option key={dept.label} value={dept.label}>
            {dept.label}
          </option>
        ))}
      </select>

      {/* Sub Category Dropdown */}
      {subCategories.length > 0 && (
        <>
          <label className="block text-gray-700 font-medium mb-1">
            {t.departmentSelector.subCategory}
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-200 mb-2"
            value={selectedSubCategory}
            onChange={(e) => {
              setSelectedSubCategory(e.target.value);
              setSelectedSubSubCategory("");
            }}
          >
            <option value="">{t.departmentSelector.selectSubCategory}</option>
            {subCategories.map((sub: any) => (
              <option key={sub.label} value={sub.label}>
                {sub.label}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Sub Sub Category Dropdown */}
      {subSubCategories.length > 0 && (
        <>
          <label className="block text-gray-700 font-medium mb-1">
            {t.departmentSelector.subSubCategory}
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-200 mb-2"
            value={selectedSubSubCategory}
            onChange={(e) => setSelectedSubSubCategory(e.target.value)}
          >
            <option value="">
              {t.departmentSelector.selectSubSubCategory}
            </option>
            {subSubCategories.map((subSub: any) => (
              <option key={subSub.label} value={subSub.label}>
                {subSub.label}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Display selected category path */}
      {currentDepartment && (
        <div className="mt-3 mb-4">
          <span className="text-sm font-medium text-gray-700">
            Selected Category:
          </span>
          <div className="mt-1 text-sm text-blue-600">{currentDepartment}</div>
          {/* Select All checkbox for sub sub category */}
          {selectedSubSubCategory && allUsersInCurrentDepartment.length > 0 && (
            <div className="mt-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  checked={allSelected}
                  onChange={(e) => {
                    if (!currentDepartment) return;
                    const newCcEmployees = { ...letterData.ccEmployees };
                    if (e.target.checked) {
                      newCcEmployees[currentDepartment] =
                        allUsersInCurrentDepartment;
                    } else {
                      // Remove all employees for this category
                      delete newCcEmployees[currentDepartment];
                    }
                    setLetterData({
                      ...letterData,
                      ccEmployees: newCcEmployees,
                    });
                  }}
                />
                <span className="ml-2 text-sm text-gray-700">
                  {selectedSubSubCategory}
                </span>
              </label>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 border-t pt-2">
        <input
          type="text"
          placeholder="Search employees..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
          onChange={(e) => setSearchEmployees(e.target.value)}
          value={searchEmployees}
        />

        {loadingUsers ? (
          <div className="text-gray-500 text-sm">Loading employees...</div>
        ) : searchEmployees ? (
          // Search results section
          <div className="space-y-4">
            {Object.entries(filteredEmployees).map(([dept, employees]) => (
              <div key={dept} className="border-b pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {employees.map((emp) => (
                    <label
                      key={emp}
                      className="inline-flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={
                          letterData.ccEmployees[dept]?.includes(emp) || false
                        }
                        onChange={(e) => {
                          const updatedEmployees = e.target.checked
                            ? [...(letterData.ccEmployees[dept] || []), emp]
                            : letterData.ccEmployees[dept]?.filter(
                                (x: string) => x !== emp
                              ) || [];
                          setLetterData({
                            ...letterData,
                            ccEmployees: {
                              ...letterData.ccEmployees,
                              [dept]: updatedEmployees,
                            },
                          });
                        }}
                      />
                      <span>{emp}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : currentDepartment ? (
          // Display users for selected department when not searching
          <div className="grid grid-cols-2 gap-2">
            {(employeesByDepartment[currentDepartment.toLowerCase()] || []).map(
              (emp) => (
                <label key={emp} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={
                      letterData.ccEmployees[currentDepartment]?.includes(
                        emp
                      ) || false
                    }
                    onChange={(e) => {
                      const updatedEmployees = e.target.checked
                        ? [
                            ...(letterData.ccEmployees[currentDepartment] ||
                              []),
                            emp,
                          ]
                        : letterData.ccEmployees[currentDepartment]?.filter(
                            (x: string) => x !== emp
                          ) || [];
                      setLetterData({
                        ...letterData,
                        ccEmployees: {
                          ...letterData.ccEmployees,
                          [currentDepartment]: updatedEmployees,
                        },
                      });
                    }}
                  />
                  <span>{emp}</span>
                </label>
              )
            )}
          </div>
        ) : null}

        {/* Display fully selected departments */}
        {fullySelectedDepts.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Selected Categories:
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {fullySelectedDepts.map((dept) => (
                <span
                  key={dept}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm"
                >
                  {dept.split(" > ").pop()}
                  <button
                    type="button"
                    onClick={() => {
                      const newCcEmployees = { ...letterData.ccEmployees };
                      delete newCcEmployees[dept];
                      setLetterData({
                        ...letterData,
                        ccEmployees: newCcEmployees,
                      });
                    }}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Display individually selected employees */}
        {Object.entries(individualRecipients).map(
          ([dept, employees]) =>
            employees.length > 0 && (
              <div key={dept} className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  CC Recipients ({employees.length} selected):
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {employees.map((emp: string) => (
                    <span
                      key={emp}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                    >
                      {emp}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedEmployees =
                            letterData.ccEmployees[dept]?.filter(
                              (x: string) => x !== emp
                            ) || [];
                          setLetterData({
                            ...letterData,
                            ccEmployees: {
                              ...letterData.ccEmployees,
                              [dept]: updatedEmployees,
                            },
                          });
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Employees;
