import React, { useState } from "react";

type DepartmentOption = {
  label: string;
  subDepartments?: DepartmentOption[];
};

const departments: DepartmentOption[] = [
  {
    label: "ዋና ዳይሬክተር",
    subDepartments: [
      {
        label: "የጽፈት ቤት ኃላፊ",
        subDepartments: [
          { label: "የህዝብ ግንኙነት ስራ አስፈጻሚ" },
          { label: "የህግ አገልግሎት ስራ አስፈጻሚ" },
          { label: "ኦዲት ስራ አስፈጻሚ" },
          { label: "የስነ ምግባርና ፀረ ሙስና ስራ አስፈጻሚ" },
          { label: "የሴቶችና ማህበራዊ አካቶ ትግበራ ስራ አስፈጻሚ" },
        ],
      },
      {
        label: "የስራ አመራር ዋና ስራ አስፈጻሚ",
        subDepartments: [
          { label: "ስትራቴጂክ ጉዳዮች ስራ አስፈጻሚ" },
          { label: "ኢንፎርሜሽን ኮሙኒኬሽን ቴክኖሎጂ ስራ አስፈጻሚ" },
          { label: "የግዢና ፋይናንስ ስራ አስፈጻሚ" },
          { label: "የብቃትና ሰው ሀብት አስተዳደር ስአስፈጻሚ" },
          { label: "ተቋማዊ ለውጥ ስራ አስፈጻሚ" },
        ],
      },
      {
        label: "የስፔስ ዘርፍ",
        subDepartments: [
          { label: "አስትሮኖሚና አስትሮፊዚክስ መሪ ስራ አስፈጻሚ" },
          { label: "ስፔስና ፕላኔታሪ ሳይንስ መሪ ስራ አስፈጻሚ" },
          { label: "የሪሞት ሴንሲንግ መሪ ስራ አስፈጻሚ" },
          { label: "ጂኦዴሲና ጂኦዳይናሚክ መሪ ስራ አስፈጻሚ" },
          { label: "ኤሮስፔስ ኢንጂነሪንግ መሪ ስራ አስፈጻሚ" },
          { label: "የሳተላይት ኦፕሬሽን መሪ ስራ አስፈጻሚ" },
          { label: "የድህረ ምረቃ፤ ሪጅስትራርና ምርምር አስተዳደር መሪ ስራ አስፈጻሚ" },
        ],
      },
      {
        label: "የጂኦስፓሻል ዘርፍ",
        subDepartments: [
          { label: "የአየር ላይ ቅይሳ መሪ ስራ አስፈጻሚ" },
          { label: "የፎቶግራሜትሪና ሊዳር ዳታ ፕሮሰሲንግ መሪ ስራ አስፈጻሚ" },
          { label: "የካርታ ስራ መሪ ስራ አስፈጻሚ" },
          { label: "የጂኦዴቲክ መሠረተ ልማት እና አገልግሎት መሪ ስራ አስፈጻሚ" },
          { label: "የዲጂታል ኢሜጅ ፕሮሰሲንግ መሪ ስራ አስፈጻሚ" },
          { label: "የስፓሻል ፕላኒንግ እና የውሳኔ ድጋፍ መሪ ስራ አስፈጻሚ" },
        ],
      },
      {
        label: "የስፔስና ጂኦስፓሻል አስቻይ ዘርፍ",
        subDepartments: [
          { label: "የስፔስ እና ጂኦስፓሻል መረጃ ስታንዳርዳይዜሽን መሪ ስራ አስፈጻሚ" },
          { label: "የፕላትፎርምናአፕሊኬሽን ልማት መሪ ስራ አስፈጻሚ" },
          { label: "የዳታና ሲስተም አስተዳደር መሪ ስራ አስፈጻሚ" },
          { label: "የቴከኖሎጂ ሽግግር መሪ ስራ አስፈጻሚ" },
          { label: "የስፔስ ሳይንስና ጂኦስፓሻል ቀጠናዊ ትስስር መሪ ስራ አስፈጻሚ" },
          { label: "የፖሊሲና ህግ ማዕቀፍ መሪ ስራ አስፈጻሚ" },
        ],
      },
    ],
  },
];

const flattenDepartments = (
  options: DepartmentOption[],
  parentLabel = ""
): { label: string; value: string }[] => {
  let result: { label: string; value: string }[] = [];
  options.forEach((opt) => {
    const fullLabel = parentLabel ? `${parentLabel} > ${opt.label}` : opt.label;
    result.push({ label: fullLabel, value: fullLabel });
    if (opt.subDepartments) {
      result = result.concat(flattenDepartments(opt.subDepartments, fullLabel));
    }
  });
  return result;
};

const DepartmentSelector: React.FC<{ onChange: (value: string) => void }> = ({
  onChange,
}) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedSubSubCategory, setSelectedSubSubCategory] =
    useState<string>("");

  const handleMainCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMainCategory(event.target.value);
    setSelectedSubCategory("");
    setSelectedSubSubCategory("");
    onChange(event.target.value);
  };

  const handleSubCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSubCategory(event.target.value);
    setSelectedSubSubCategory("");
    onChange(`${selectedMainCategory} > ${event.target.value}`);
  };

  const handleSubSubCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSubSubCategory(event.target.value);
    onChange(
      `${selectedMainCategory} > ${selectedSubCategory} > ${event.target.value}`
    );
  };

  const subCategories =
    departments.find((dept) => dept.label === selectedMainCategory)
      ?.subDepartments || [];
  const subSubCategories =
    subCategories.find((sub) => sub.label === selectedSubCategory)
      ?.subDepartments || [];

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">ዋና ምድብ</label>
      <select
        className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-200 mb-2"
        value={selectedMainCategory}
        onChange={handleMainCategoryChange}
      >
        <option value="">-- ዋና ምድብ ይምረጡ --</option>
        {departments.map((dept) => (
          <option key={dept.label} value={dept.label}>
            {dept.label}
          </option>
        ))}
      </select>

      {subCategories.length > 0 && (
        <>
          <label className="block text-gray-700 font-medium mb-1">
            ንዑስ ምድብ
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-200 mb-2"
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
          >
            <option value="">-- ንዑስ ምድብ ይምረጡ --</option>
            {subCategories.map((sub) => (
              <option key={sub.label} value={sub.label}>
                {sub.label}
              </option>
            ))}
          </select>
        </>
      )}

      {subSubCategories.length > 0 && (
        <>
          <label className="block text-gray-700 font-medium mb-1">
            ንዑስ ንዑስ ምድብ
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-200 mb-2"
            value={selectedSubSubCategory}
            onChange={handleSubSubCategoryChange}
          >
            <option value="">-- ንዑስ ንዑስ ምድብ ይምረጡ --</option>
            {subSubCategories.map((subSub) => (
              <option key={subSub.label} value={subSub.label}>
                {subSub.label}
              </option>
            ))}
          </select>
        </>
      )}

      {(selectedMainCategory ||
        selectedSubCategory ||
        selectedSubSubCategory) && (
        <div style={{ marginTop: "20px", color: "green" }}>
          የተመረጠ ምድብ:{" "}
          <strong>
            {[selectedMainCategory, selectedSubCategory, selectedSubSubCategory]
              .filter(Boolean)
              .join(" > ")}
          </strong>
        </div>
      )}
    </div>
  );
};

export default DepartmentSelector;
