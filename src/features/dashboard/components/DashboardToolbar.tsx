import { useDashboardFilters } from "../state/dashboardFilters";

const presets: Array<{ key: "today" | "7d" | "30d" | "90d"; label: string }> = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7d" },
  { key: "30d", label: "Last 30d" },
  { key: "90d", label: "Last 90d" },
];

export default function DashboardToolbar() {
  const { preset, setPreset, refresh } = useDashboardFilters();

  return (
    <div
      className="dash-toolbar min-h-12"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) auto",
        alignItems: "center",
        columnGap: "0.5rem",
      }}
    >
      <h1
        className="text-lg font-semibold text-white"
        style={{
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          margin: 0,
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          justifySelf: "end",
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          whiteSpace: "nowrap",
          overflowX: "auto",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <style>{`.dash-toolbar > div::-webkit-scrollbar{display:none}`}</style>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "nowrap" }}>
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
