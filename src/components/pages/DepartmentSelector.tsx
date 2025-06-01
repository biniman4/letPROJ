import React from "react";

type Sector = {
  name: string;
  children?: string[];
};

const sectors: Sector[] = [
  {
    name: "Geospatial Sector",
    children: [
      "Aerial surveying",
      "Digital image processing",
      "Mapping",
      "Photogrammetry and lidar data",
      "Processing",
      "Geodetic Infrastructure and Service",
      "Spacial planning and decision support",
    ],
  },
  {
    name: "Key Decission Enblers",
    children: [
      "Data and System Administration",
      "Platform and Application Development",
      "Policy and Legal Framework",
      "Space and Geospatial Information",
      "Standardization",
      "Regional Partnership Lead Executive",
      "Training & Technology Transfer",
    ],
  },
  {
    name: "Space Sector",
    children: [
      "Aerospace and Satellite Communication",
      "Astronomy and Astrophysics",
      "Geodesy and Geodynamics",
      "Remote sensing",
      "Satellite Operations",
      "Space and Planetary Science",
    ],
  },
  {
    name: "Products and services",
    children: ["Scientific Publications"],
  },
  { name: "Trainings" },
  { name: "Projects" },
];

interface DepartmentSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

// Flattens sectors and subsectors for dropdown
const getDepartmentOptions = () => {
  const options: { label: string; value: string }[] = [];
  sectors.forEach((sector) => {
    if (sector.children) {
      sector.children.forEach((child) => {
        options.push({
          label: `${sector.name} > ${child}`,
          value: `${sector.name} > ${child}`,
        });
      });
    } else {
      options.push({ label: sector.name, value: sector.name });
    }
  });
  return options;
};

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({ value, onChange }) => {
  const options = getDepartmentOptions();
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">
        Department or Sector <span className="text-red-500">*</span>
      </label>
      <select
        className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All Departments</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DepartmentSelector;