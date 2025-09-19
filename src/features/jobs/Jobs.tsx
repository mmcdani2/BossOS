// src/features/jobs/Jobs.tsx
import React from "react";
import { Plus, Filter, Search, ClipboardCheck } from "lucide-react";
import PageHeader from "../../ui/PageHeader";
import ViewToolbar from "../../ui/ViewToolbar";
import GlassCard from "../../ui/GlassCard";

type JobStatus = "Scheduled" | "In Progress" | "Completed";

export default function Jobs() {
  // demo rows; replace with real data
  const rows = Array.from({ length: 40 }).map((_, i) => ({
    title: `Replace condensing unit #${i + 1}`,
    date: "Jul 24",
    time: "9:00–10:30a",
    customer: "Acme Corp",
    status: (i % 3 === 0
      ? "In Progress"
      : i % 3 === 1
      ? "Scheduled"
      : "Completed") as JobStatus,
  }));

  return (
    <>
      <PageHeader />

      {/* Lock the route to the viewport between top nav & BottomNav */}
      <div
        className="shell"
        style={{
          height: "calc(100vh - var(--nav-h) - var(--bottom-nav-h))",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // page itself doesn't scroll
        }}
      >
        {/* Sticky toolbar directly under the top nav (same as Scheduler) */}
        <div className="sticky-under-nav">
          <ViewToolbar
            label="Jobs"
            right={
              <button className="dt-refresh" title="New Job">
                <Plus className="h-4 w-4" />
                <span className="sr-only">New Job</span>
              </button>
            }
          />
        </div>

        {/* Sticky Filters + KPIs (like Scheduler keeps the day header sticky) */}
        <div
          style={{
            position: "sticky",
            top: "calc(var(--nav-h) + var(--toolbar-h, 56px))",
            zIndex: 30,
          }}
        >
          {/* Filters */}
          <GlassCard className="p-3 mt-3">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1fr) auto",
                alignItems: "center",
                columnGap: "0.5rem",
              }}
            >
              <div className="relative min-w-0">
                <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
                <input
                  placeholder="Search jobs, address, customer…"
                  className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
                />
              </div>

              {/* right controls; stay to the edge and allow horizontal scroll if tight */}
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
                <style>{`.jobs-controls::-webkit-scrollbar{display:none}`}</style>
                <button className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white shrink-0">
                  <Filter className="h-4 w-4" /> Filters
                </button>
                <div className="flex items-center gap-2 text-white/60 text-sm shrink-0">
                  <span>Status:</span>
                  <select className="h-9 rounded-md border border-white/10 bg-white/5 text-white px-2">
                    <option>All</option>
                    <option>Scheduled</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              ["Scheduled", "12"],
              ["In Progress", "4"],
              ["Completed today", "18"],
              ["Overdue", "2"],
            ].map(([label, value]) => (
              <GlassCard key={label} className="p-4">
                <div className="text-white/60 text-xs">{label}</div>
                <div className="text-white text-xl font-semibold mt-1">
                  {value}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Remaining space: a box that behaves like the Scheduler box */}
        {/* Remaining space: Jobs list box (identical pattern to Scheduler) */}
<div className="schedule-container mt-16" style={{ flex: 1, minHeight: 0 }}>
  {/* The ONLY scrolling part */}
  <div className="schedule-scroll">
    {/* Sticky header lives INSIDE the scroller so it pins to this card, not the viewport */}
    <div
      className="
        schedule-header hidden md:grid
        grid-cols-[1fr_120px_120px_160px_120px]
      "
    >
      <div className="px-4 py-2 text-white/60">Job</div>
      <div className="px-4 py-2 text-white/60">Date</div>
      <div className="px-4 py-2 text-white/60">Time</div>
      <div className="px-4 py-2 text-white/60">Customer</div>
      <div className="px-4 py-2 text-white/60">Status</div>
    </div>

    {/* MOBILE list (cards) */}
    <div className="md:hidden divide-y divide-white/10">
      {rows.map((r, i) => (
        <div key={i} className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ClipboardCheck className="h-4 w-4 text-white/50" />
              <div className="truncate text-white">{r.title}</div>
            </div>
            <span
              className={`ml-auto shrink-0 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] border ${
                r.status === "Completed"
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                  : r.status === "In Progress"
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                  : "border-sky-400/40 bg-sky-400/10 text-sky-200"
              }`}
            >
              {r.status}
            </span>
          </div>
          <div className="mt-1 text-white/70 text-xs flex items-center gap-2">
            <span>{r.date}</span>
            <span className="opacity-50">•</span>
            <span>{r.time}</span>
            <span className="opacity-50">•</span>
            <span className="truncate">{r.customer}</span>
          </div>
        </div>
      ))}
    </div>

    {/* DESKTOP rows (under the sticky header) */}
    <div className="hidden md:grid text-sm grid-cols-[1fr_120px_120px_160px_120px]">
      {rows.map((r, i) => (
        <React.Fragment key={i}>
          <div className="px-4 py-3 text-white border-b border-white/10 flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-white/50" />
            <span className="truncate">{r.title}</span>
          </div>
          <div className="px-4 py-3 text-white/80 border-b border-white/10">
            {r.date}
          </div>
          <div className="px-4 py-3 text-white/80 border-b border-white/10">
            {r.time}
          </div>
          <div className="px-4 py-3 text-white/80 border-b border-white/10">
            {r.customer}
          </div>
          <div className="px-4 py-3 border-b border-white/10">
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs border ${
                r.status === "Completed"
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                  : r.status === "In Progress"
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                  : "border-sky-400/40 bg-sky-400/10 text-sky-200"
              }`}
            >
              {r.status}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
</div>

      </div>
    </>
  );
}
