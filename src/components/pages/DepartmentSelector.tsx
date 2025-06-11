import React, { useState } from 'react';

type DepartmentOption = {
  label: string;
  subDepartments?: DepartmentOption[];
};

const departments: DepartmentOption[] = [
  {
    label: 'ዋና ዳይሬክተር',
    subDepartments: [
      {
        label: 'የአስተዳደር እና ፋይናንስ',
        subDepartments: [
          { label: 'የሰብል ኃይል እና ማህበራዊ አገልግሎት' },
          { label: 'የገንዘብ እና ቁሳቁስ አስተዳደር' },
          { label: 'ማህበራዊ አገልግሎት' },
          { label: 'የኢንፎርሜሽን ቴክኖሎጂ አገልግሎት' },
          { label: 'የጽ/ቤት አገልግሎት' },
          { label: 'የባንዲራ እና መንቅሳቃሽ አገልግሎት' },
        ],
      },
      {
        label: 'የሕግ እና ከተባበሩ አገልግሎቶች',
        subDepartments: [
          { label: 'የሕግ አገልግሎት' },
          { label: 'የልዩ አገልግሎት እና ምክር አቤቱታ' },
          { label: 'አዋጅ ቅጥር እና ማስተናገድ' },
          { label: 'የማህበራዊ ግንኙነት አገልግሎት' },
        ],
      },
    ],
  },
  {
    label: 'የዲፓርትመንት ኮኦርዲኔተሮች',
    subDepartments: [
      {
        label: 'የቀበሌ HCs',
        subDepartments: [
          { label: 'የመሃል አካባቢ እና ሰበር ቀበሌ ህክምና ተቋማት' },
          { label: 'የካፍቶ እና ቀደም ቀበሌ ህክምና ተቋማት' },
          { label: 'የማእከላዊ እና ከተማ አቀፍ ህክምና ተቋማት' },
        ],
      },
      {
        label: 'የአካባቢ HCs',
        subDepartments: [
          { label: 'የካንካ ህክምና ተቋማት' },
          { label: 'የጉላላ እና ተዛማጅ ተቋማት' },
          { label: 'የሀምሌ እና ተቋማት' },
        ],
      },
      {
        label: 'የተለያዩ አገልግሎቶችን አቅርበው የሚሰጡ HCs',
        subDepartments: [
          { label: 'የታላቁ ህክምና ተቋማት (ሃረማያ, እና ሌሎች)' },
          { label: 'የአካባቢ የህዝብ ጤና ተቋማት' },
          { label: 'የአሰላላሊ ጤና ተቋማት' },
        ],
      },
    ],
  },
];

const flattenDepartments = (options: DepartmentOption[], parentLabel = ""): { label: string; value: string }[] => {
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

const DepartmentSelector: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedSubDepartment, setSelectedSubDepartment] = useState<string>("");

  // Custom department list for first dropdown
  const mainDepartmentLabels = [
    'የአስተዳደር እና ፋይናንስ',
    'የሕግ እና ከተባበሩ አገልግሎቶች',
    'የዲፓርትመንት ኮኦርዲኔተሮች',
    'የአካባቢ HCs',
    'የተለያዩ አገልግሎቶችን አቅርበው የሚሰጡ HCs',
  ];

  // Find all department objects matching the above labels (search recursively)
  function findDepartmentsByLabels(options: DepartmentOption[], labels: string[]): DepartmentOption[] {
    let found: DepartmentOption[] = [];
    for (const opt of options) {
      if (labels.includes(opt.label)) {
        found.push(opt);
      }
      if (opt.subDepartments) {
        found = found.concat(findDepartmentsByLabels(opt.subDepartments, labels));
      }
    }
    return found;
  }

  const mainDepartments = findDepartmentsByLabels(departments, mainDepartmentLabels);

  // Find the selected department object
  const selectedDeptObj = mainDepartments.find(d => d.label === selectedDepartment);
  // Flatten subdepartments for dropdown
  const subDepartmentOptions = selectedDeptObj && selectedDeptObj.subDepartments
    ? selectedDeptObj.subDepartments.flatMap(sub => {
        if (sub.subDepartments) {
          return sub.subDepartments.map(s => ({
            label: `${sub.label} > ${s.label}`,
            value: `${sub.label} > ${s.label}`
          }));
        } else {
          return [{ label: sub.label, value: sub.label }];
        }
      })
    : [];

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">ዋና ዳይሬክተር / የዲፓርትመንት ምረጥ</label>
      <select
        className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-200 mb-2"
        value={selectedDepartment}
        onChange={e => {
          setSelectedDepartment(e.target.value);
          setSelectedSubDepartment("");
        }}
      >
        <option value="">-- የዲፓርትመንት ይምረጡ --</option>
        {mainDepartments.map(opt => (
          <option key={opt.label} value={opt.label}>{opt.label}</option>
        ))}
      </select>
      {selectedDepartment && subDepartmentOptions.length > 0 && (
        <>
          <label className="block text-gray-700 font-medium mb-1">ንዑስ ክፍል / ምድብ ይምረጡ</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-200"
            value={selectedSubDepartment}
            onChange={e => setSelectedSubDepartment(e.target.value)}
          >
            <option value="">-- ንዑስ ክፍል/ምድብ ይምረጡ --</option>
            {subDepartmentOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </>
      )}
      {(selectedDepartment || selectedSubDepartment) && selectedSubDepartment && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          የተመረጠ ክፍል: <strong>{selectedDepartment} &gt; {selectedSubDepartment.replace(/^.*> /, '')}</strong>
        </div>
      )}
      {(selectedDepartment && !selectedSubDepartment) && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          የተመረጠ ክፍል: <strong>{selectedDepartment}</strong>
        </div>
      )}
    </div>
  );
};

export default DepartmentSelector;