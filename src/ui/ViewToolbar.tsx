import { ReactNode } from "react";

/** One-line toolbar: label truncates; actions pinned right (inline grid styles) */
export default function ViewToolbar({
  label,
  right,
}: {
  label: ReactNode;
  right?: ReactNode;
}) {
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
      {/* Left: label truncates, never forces a wrap */}
      <h1
        className="text-lg font-semibold text-basecolor"
        style={{
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          margin: 0,
        }}
      >
        {label}
      </h1>

      {/* Right: actions pinned right, never wrap; tiny horizontal scroll if cramped */}
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
        {/* hide webkit scrollbar */}
        <style>{`.dash-toolbar > div::-webkit-scrollbar{display:none}`}</style>
        {right}
      </div>
    </div>
  );
}
