"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const BackgroundRippleEffect = ({
  rows = 8,
  cols = 27,
  cellSize = 56,
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
}) => {
  const [clickedCell, setClickedCell] = useState<{ row: number; col: number } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 h-full w-full",
        "[--cell-border-color:var(--color-neutral-300)] [--cell-fill-color:var(--color-neutral-100)] [--cell-shadow-color:var(--color-neutral-500)]",
        "dark:[--cell-border-color:var(--color-neutral-700)] dark:[--cell-fill-color:var(--color-neutral-900)] dark:[--cell-shadow-color:var(--color-primary-800)]"
      )}
    >
      {/* 🔹 Interactive grid on top of fade */}
      <div className="relative z-[2] pointer-events-auto">
        <DivGrid
          key={`base-${rippleKey}`}
          className="opacity-70"
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          borderColor="var(--cell-border-color)"
          fillColor="var(--cell-fill-color)"
          clickedCell={clickedCell}
          onCellClick={(row, col) => {
            setClickedCell({ row, col });
            setRippleKey((k) => k + 1);
          }}
          interactive
        />
      </div>
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number;
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

type CellStyle = React.CSSProperties & {
  ["--delay"]?: string;
  ["--duration"]?: string;
};

const DivGrid = ({
  className,
  rows,
  cols,
  cellSize = 56,
  borderColor = "#3f3f46",
  fillColor = "rgba(14,165,233,0.3)",
  clickedCell = null,
  onCellClick = () => { },
  interactive = true,
}: DivGridProps) => {
  const [dims, setDims] = useState({ rows, cols });

  // Dynamically fit grid to viewport
  useEffect(() => {
    const calculateGrid = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const newCols = Math.ceil(viewportWidth / cellSize);
      const newRows = Math.ceil(viewportHeight / cellSize / 2); // only top half
      setDims({ rows: newRows, cols: newCols });
    };
    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, [cellSize]);

  const cells = useMemo(
    () => Array.from({ length: dims.rows * dims.cols }, (_, idx) => idx),
    [dims.rows, dims.cols]
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${dims.cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${dims.rows}, ${cellSize}px)`,
    width: dims.cols * cellSize,
    height: dims.rows * cellSize,
    marginInline: "auto",
  };

  return (
    <div className={cn("relative z-[3] mask-gradient-to-b from-white to-transparent", className)} style={{
      ...gridStyle,
      WebkitMaskImage:
        "linear-gradient(to bottom, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)",
      maskImage:
        "linear-gradient(to bottom, rgba(255,255,255,1) 20%, rgba(255,255,255,0) 100%)",
      maskSize: "100% 100%",
      maskRepeat: "no-repeat",
    }}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / dims.cols);
        const colIdx = idx % dims.cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 55) : 0;
        const duration = 200 + distance * 80;

        const style: CellStyle = clickedCell
          ? {
            "--delay": `${delay}ms`,
            "--duration": `${duration}ms`,
          }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border-[0.5px] opacity-40 transition-opacity duration-150 will-change-transform hover:opacity-95 dark:shadow-[0px_0px_40px_1px_var(--cell-shadow-color)_inset]",
              clickedCell && "animate-cell-ripple [animation-fill-mode:none]",
              !interactive && "pointer-events-none"
            )}
            style={{
              backgroundColor: fillColor,
              borderColor: borderColor,
              ...style,
            }}
            onClick={interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined}
          />
        );
      })}
    </div>
  );
};
