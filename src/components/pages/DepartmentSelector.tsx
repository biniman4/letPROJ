import React, { useState } from "react";

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
    children: [
      "Scientific Publications"
    ],
  },
  { name: "Trainings" },
  { name: "Projects" },
];

interface DepartmentSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  value,
  onChange,
}) => {
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedSectorName, setSelectedSectorName] = useState<string | null>(null);
  const [selectedSubsector, setSelectedSubsector] = useState<string | null>(null);

  // handle selection for both sector and subsector
  const handleSectorClick = (sector: Sector) => {
    if (sector.children) {
      setSelectedSector(sector);
      setSelectedSectorName(sector.name);
      setSelectedSubsector(null);
    } else {
      setSelectedSector(null);
      setSelectedSectorName(sector.name);
      setSelectedSubsector(null);
      onChange(sector.name);
    }
  };

  const handleSubsectorClick = (sub: string) => {
    setSelectedSubsector(sub);
    if (selectedSectorName) {
      onChange(`${selectedSectorName} > ${sub}`);
    }
  };

  // Color palette - updated to more professional colors
  const bgMain = "bg-white border border-gray-200 shadow-md";
  const bgSub = "bg-gray-50 shadow-sm";
  const sectorActive = "bg-blue-600 text-white shadow-md";
  const itemActive = "bg-blue-600 text-white shadow-md";

  // For display: parse value into sector & subsector if available
  let displaySector = value;
  let displaySubsector = "";
  if (value && value.includes(" > ")) {
    [displaySector, displaySubsector] = value.split(" > ");
  }

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">
        Department or Sector <span className="text-red-500">*</span>
      </label>
      <div className={`rounded-lg p-4 ${bgMain} transition-all duration-300`}>
        {!selectedSector && (
          <div>
            <div className="mb-2 text-base font-semibold text-gray-700">Select a Sector</div>
            {sectors.map((sector) => (
              <div key={sector.name} className="mb-2">
                <div
                  className={`flex items-center cursor-pointer justify-between py-2 px-4 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md ${
                    value === sector.name ? sectorActive : "bg-gray-50 text-gray-700"
                  }`}
                  onClick={() => handleSectorClick(sector)}
                >
                  <span>{sector.name}</span>
                  {sector.children && (
                    <span className="ml-2 text-2xl">{value === sector.name ? "→" : "→"}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedSector && (
          <div className={`rounded-lg p-3 ${bgSub} transition-all duration-300`}>
            <div className="flex items-center mb-4 text-gray-700">
              <button
                type="button"
                className="mr-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold shadow hover:shadow-md transition-all duration-300"
                onClick={() => setSelectedSector(null)}
              >
                ← Back
              </button>
              <span className="font-semibold text-lg">{selectedSector.name}</span>
            </div>
            {selectedSector.children?.map((child) => (
              <div
                key={child}
                className={`py-2 px-4 mb-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md ${
                  value === `${selectedSector.name} > ${child}` ? itemActive : "bg-white text-gray-700"
                }`}
                onClick={() => handleSubsectorClick(child)}
              >
                {child}
              </div>
            ))}
          </div>
        )}
      </div>
      {value && (
        <div className="mt-2 text-gray-600 text-sm">
          Selected: <span className="font-semibold">
            {displaySector}
            {displaySubsector ? <span> &gt; {displaySubsector}</span> : null}
          </span>
        </div>
      )}
    </div>
  );
};

export default DepartmentSelector;