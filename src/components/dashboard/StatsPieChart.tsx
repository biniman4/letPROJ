import React, { useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const PIE_COLORS = [
  "#3b82f6", // blue-500
  "#22c55e", // green-500
  "#fbbf24", // yellow-400
  "#ef4444", // red-500
  "#6366f1", // indigo-500
  "#0ea5e9", // sky-500
];

export function StatsPieChart({ data }: { data: { name: string; value: number }[] }) {
  const chartRef = useRef<any>(null);
  const chartData = {
    labels: data.map((d) => d.name.split('>').pop()?.trim() || d.name),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: PIE_COLORS,
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 12,
        hoverBorderColor: "#2563eb",
      },
    ],
  };
  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h3
        className="font-semibold mb-2 text-2xl bg-gradient-to-r from-[#b97b2a] via-[#cfae7b] to-[#cfc7b7] text-transparent bg-clip-text transition-all duration-200 hover:underline hover:text-3xl cursor-pointer"
        tabIndex={0}
      >
        Letters by Department
      </h3>
      <Pie ref={chartRef} data={chartData} options={options} />
      <div className="mt-4 max-h-32 overflow-y-auto flex flex-col gap-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {chartData.labels.map((label: string, idx: number) => (
          <div key={label} className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
            <span className="text-sm text-gray- 700">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 