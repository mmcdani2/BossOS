import { useDashboardFilters } from "../state/dashboardFilters";

const presets: Array<{key: "today"|"7d"|"30d"|"90d"; label: string}> = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7d" },
  { key: "30d", label: "Last 30d" },
  { key: "90d", label: "Last 90d" },
];

export default function DashboardToolbar() {
  const { preset, setPreset, refresh } = useDashboardFilters();

  return (
    <div className="dash-toolbar">
      <h1>Dashboard</h1>

      <div className="dt-group">
        <div className="dt-segment">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => setPreset(p.key)}
              className={`dt-btn ${preset === p.key ? "dt-btn--active" : ""}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button className="dt-refresh" onClick={refresh} title="Manual refresh">
          Refresh
        </button>
      </div>
    </div>
  );
}
