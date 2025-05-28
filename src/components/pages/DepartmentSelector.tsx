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

  // Color palette
  const bgMain = "bg-gradient-to-br from-indigo-400 via-blue-400 to-teal-300";
  const bgSub = "bg-gradient-to-br from-teal-50 via-blue-100 to-indigo-100";
  const sectorActive = "bg-indigo-700 text-white";
  const itemActive = "bg-teal-600 text-white";

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
      <div className={`rounded-xl p-4 shadow-inner ${bgMain} transition-all duration-300`}>
        {!selectedSector && (
          <div>
            <div className="mb-2 text-base font-semibold text-white">Select a Sector</div>
            {sectors.map((sector) => (
              <div key={sector.name} className="mb-2">
                <div
                  className={`flex items-center cursor-pointer justify-between py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors text-lg font-medium shadow-sm ${
                    value === sector.name ? sectorActive : "bg-white bg-opacity-20 text-white"
                  }`}
                  onClick={() => handleSectorClick(sector)}
                >
                  <span>{sector.name}</span>
                  {sector.children && (
                    <span className="ml-2 text-2xl">→</span>
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
                className="mr-2 px-3 py-1 rounded-full bg-indigo-500 text-white text-xs font-semibold shadow hover:bg-indigo-700 transition"
                onClick={() => setSelectedSector(null)}
              >
                ← Back
              </button>
              <span className="font-semibold text-lg">{selectedSector.name}</span>
            </div>
            {selectedSector.children?.map((child) => (
              <div
                key={child}
                className={`py-2 px-4 mb-2 rounded-lg cursor-pointer hover:bg-teal-400 hover:text-white transition-all text-base font-medium shadow-sm ${
                  value === `${selectedSector.name} > ${child}` ? itemActive : "bg-white bg-opacity-70 text-indigo-800"
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
        <div className="mt-2 text-teal-700 text-sm">
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