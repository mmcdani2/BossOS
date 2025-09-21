import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

export type UiOption = { label: string; value: string };

export default function UiSelect({
  value,
  onChange,
  options,
  className = "",
  placeholder = "Select…",
  width = 180,
}: {
  value: string;
  onChange: (v: string) => void;
  options: UiOption[];
  className?: string;
  placeholder?: string;
  width?: number | string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number>(-1);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedIdx = useMemo(
    () => options.findIndex((o) => o.value === value),
    [options, value]
  );
  useEffect(() => setActive(selectedIdx), [selectedIdx]);

  // Close on outside click / Escape / route scroll/resize
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onWin = () => setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onWin, true);
    window.addEventListener("resize", onWin);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onWin, true);
      window.removeEventListener("resize", onWin);
    };
  }, [open]);

  // Keyboard nav
  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      setActive(Math.max(0, selectedIdx));
      return;
    }
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(options.length - 1, (a < 0 ? 0 : a) + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, (a < 0 ? 0 : a) - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = options[active] ?? options[0];
      if (pick) onChange(pick.value);
      setOpen(false);
    }
  }

  const selected = options.find((o) => o.value === value);

  // Compute portal menu position
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMenuStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 1000,
    });
  }, [open]);

  return (
    <div className={`relative inline-block ${className}`} style={{ width }}>
      {/* Trigger button */}
      <button
        ref={btnRef}
        type="button"
        className="w-full h-9 px-3 pr-8 rounded-md border border-white/10 bg-white/5
                   text-white text-sm flex items-center justify-between
                   hover:bg-white/10 transition-colors outline-none focus:border-indigo-400/50"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span className={`truncate ${selected ? "text-white" : "text-white/50"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="absolute right-2 h-4 w-4 text-white/60 pointer-events-none" />
      </button>

      {/* Portal menu (escapes overflow of toolbars/cards) */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            tabIndex={-1}
            style={menuStyle}
            className="rounded-lg border border-white/10 bg-[#17181b]/95
                       shadow-lg backdrop-blur overflow-auto max-h-64 z-50"
            onKeyDown={onKeyDown}
          >
            {options.map((o, i) => {
              const isSel = o.value === value;
              const isAct = i === active;
              return (
                <div
                  key={o.value}
                  role="option"
                  aria-selected={isSel}
                  className={`px-3 py-2 text-sm cursor-pointer select-none flex items-center
                              ${isAct ? "bg-white/10" : ""}
                              ${isSel ? "text-white" : "text-white/80 hover:text-white"}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(o.value);
                    setOpen(false);
                  }}
                >
                  {o.label}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}
