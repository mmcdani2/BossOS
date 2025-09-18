// src/ui/ViewToolbar.tsx
import { ReactNode } from "react";

/** Generic toolbar matching the DashboardToolbar layout */
export default function ViewToolbar({
  label,
  right,
}: {
  label: string;       // e.g. "Scheduler", "Jobs", "Estimates"
  right?: ReactNode;   // your buttons/segments/etc.
}) {
  return (
    <div className="dash-toolbar">
      <h1>{label}</h1>
      <div className="dt-group">{right}</div>
    </div>
  );
}
