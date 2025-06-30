import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useLanguage } from "./LanguageContext";

type DepartmentOption = {
  id: string;
  label: string;
  subDepartments?: DepartmentOption[];
};

const DepartmentSelector = forwardRef<
  { reset: () => void },
  {
    onChange: (value: string) => void;
    showBreadcrumb?: boolean;
    showSubDropdowns?: boolean;
  }
>(({ onChange, showBreadcrumb = true, showSubDropdowns = true }, ref) => {
  const { t, lang } = useLanguage();

  const departments: DepartmentOption[] = t.departmentSelector.departments;

  const [selectedMainId, setSelectedMainId] = useState<string>("");
  const [selectedSubId, setSelectedSubId] = useState<string>("");
  const [selectedSubSubId, setSelectedSubSubId] = useState<string>("");

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSelectedMainId("");
      setSelectedSubId("");
      setSelectedSubSubId("");
    },
  }));

  const selectedMain = departments.find((dept) => dept.id === selectedMainId);
  const subCategories = selectedMain?.subDepartments || [];
  const selectedSub = subCategories.find((sub) => sub.id === selectedSubId);
  const subSubCategories = selectedSub?.subDepartments || [];
  const selectedSubSub = subSubCategories.find((subSub) => subSub.id === selectedSubSubId);

  const getFullIdPath = () => {
    return [selectedMainId, selectedSubId, selectedSubSubId].filter(Boolean).join(" > ");
  };

  const getFullLabelPath = () => {
    return [selectedMain?.label, selectedSub?.label, selectedSubSub?.label].filter(Boolean).join(" > ");
  };

  const handleMainCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMainId(event.target.value);
    setSelectedSubId("");
    setSelectedSubSubId("");
    setTimeout(() => onChange(event.target.value), 0);
  };

  const handleSubCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSubId(event.target.value);
    setSelectedSubSubId("");
    setTimeout(() => onChange([selectedMainId, event.target.value].filter(Boolean).join(" > ")), 0);
  };

  const handleSubSubCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSubSubId(event.target.value);
    setTimeout(() => onChange(getFullIdPath()), 0);
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">
        {t.departmentSelector.mainCategory}
      </label>
      <select
        className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-200 mb-2"
        value={selectedMainId}
        onChange={handleMainCategoryChange}
      >
        <option value="">{t.departmentSelector.selectMainCategory}</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.label}
          </option>
        ))}
      </select>

      {showSubDropdowns && subCategories.length > 0 && (
        <>
          <label className="block text-gray-700 font-medium mb-1">
            {t.departmentSelector.subCategory}
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-200 mb-2"
            value={selectedSubId}
            onChange={handleSubCategoryChange}
          >
            <option value="">{t.departmentSelector.selectSubCategory}</option>
            {subCategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.label}
              </option>
            ))}
          </select>
        </>
      )}

      {showSubDropdowns && subSubCategories.length > 0 && (
        <>
          <label className="block text-gray-700 font-medium mb-1">
            {t.departmentSelector.subSubCategory}
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-200 mb-2"
            value={selectedSubSubId}
            onChange={handleSubSubCategoryChange}
          >
            <option value="">
              {t.departmentSelector.selectSubSubCategory}
            </option>
            {subSubCategories.map((subSub) => (
              <option key={subSub.id} value={subSub.id}>
                {subSub.label}
              </option>
            ))}
          </select>
        </>
      )}

      {showBreadcrumb && getFullLabelPath() && (
        <div style={{ marginTop: "20px", color: "green" }}>
          {t.departmentSelector.selectedCategory}:{" "}
          <strong>{getFullLabelPath()}</strong>
        </div>
      )}
    </div>
  );
});

export default DepartmentSelector;
