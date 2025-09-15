import React from "react";

type DashboardKpiCardProps = {
  title: string;
  value: number;
  previous?: number; // optional for growth indicator
  format?: (val: number) => string;
};

export function DashboardKpiCard({
  title,
  value,
  previous,
  format = (v) => v.toLocaleString(),
}: DashboardKpiCardProps) {
  const diff = previous !== undefined ? value - previous : undefined;
  const growth =
    diff !== undefined
      ? diff > 0
        ? { icon: "⬆️", color: "text-green-500" }
        : diff < 0
        ? { icon: "⬇️", color: "text-red-500" }
        : { icon: "➖", color: "text-gray-400" }
      : null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-md flex flex-col items-center justify-center text-center">
      <div className="text-sm font-medium text-gray-300 mb-2">{title}</div>
      <div className="text-3xl font-bold text-gray-50">
        {format(value)}
      </div>
      {growth && (
        <div className={`mt-1 text-sm font-medium ${growth.color}`}>
          {growth.icon} {format(Math.abs(diff!))}
        </div>
      )}
    </div>
  );
}
