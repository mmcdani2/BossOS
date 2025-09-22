import React from "react";

type DashboardKpiCardProps = {
  title: string;
  value: number;
  previous?: number;                 // optional for growth indicator
  format?: (val: number) => string;
  variant?: "solid" | "glass";       // default: solid (better in light mode)
  className?: string;
};

export function DashboardKpiCard({
  title,
  value,
  previous,
  format = (v) => v.toLocaleString(),
  variant = "solid",
  className = "",
}: DashboardKpiCardProps) {
  const diff = previous !== undefined ? value - previous : undefined;
  const up = diff !== undefined && diff > 0;
  const down = diff !== undefined && diff < 0;

  const growthIcon = up ? "▲" : down ? "▼" : "◆";
  const growthColor = up
    ? "var(--positive, #16a34a)"   // optional token; falls back to green
    : down
    ? "var(--negative, #dc2626)"   // optional token; falls back to red
    : "var(--text-muted)";

  const base =
    "rounded-2xl p-5 sm:p-6 text-center text-basecolor transition-colors";
  const solid =
    // Solid token card = unmistakable “card” in light mode
    "bg-surface-2 border border-token shadow-1";
  const glass =
    // Frosted look if you want it
    "glass shadow-1";

  return (
    <div className={[base, variant === "glass" ? glass : solid, className].join(" ")}>
      <div className="mb-2 text-sm font-medium text-muted">{title}</div>
      <div className="text-3xl font-bold">{format(value)}</div>

      {diff !== undefined && (
        <div
          className="mt-1 inline-flex items-center justify-center gap-1 text-sm font-medium"
          style={{ color: growthColor }}
          aria-live="polite"
        >
          <span aria-hidden>{growthIcon}</span>
          <span>{format(Math.abs(diff))}</span>
        </div>
      )}
    </div>
  );
}
