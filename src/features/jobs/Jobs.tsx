// src/features/jobs/Jobs.tsx
import React from "react";
import { Plus, Filter, Search, ClipboardCheck } from "lucide-react";
import PageHeader from "../../ui/PageHeader";
import ViewToolbar from "../../ui/ViewToolbar";
import GlassCard from "../../ui/GlassCard";

export default function Jobs() {
  // demo rows; replace with your data later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rows = Array.from({ length: 5 }).map((_, i) => ({
    title: "Replace condensing unit",
    date: "Jul 24",
    time: "9:00–10:30a",
    customer: "Acme Corp",
    status: "Scheduled" as const,
  }));

  return (
    <>
      {/* Global header (brand left, UserMenu right) */}
      <PageHeader />

      {/* Match Dashboard: everything under header sits in `.shell` */}
      <div className="shell pb-safe-bnav">
        {/* View toolbar — same layout as DashboardToolbar/Scheduler */}
        <ViewToolbar
          label="Jobs"
          right={
            <button className="dt-refresh" title="New Job">
              <Plus className="h-4 w-4" />
              <span className="sr-only">New Job</span>
            </button>
          }
        />

        {/* Filters */}
        {/* Filters */}
        <GlassCard className="p-3 mt-4">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) auto",
              alignItems: "center",
              columnGap: "0.5rem",
            }}
          >
            {/* Left: search (truncates if needed) */}
            <div className="relative min-w-0">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
              <input
                placeholder="Search jobs, address, customer…"
                className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
              />
            </div>

            {/* Right: controls pinned right, never wrap (scrolls a bit if tight) */}
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

        {/* Stats */}
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

        {/* List */}
        <GlassCard className="p-0 overflow-hidden mt-4">
          {/* MOBILE (< md): stacked cards with status pinned to far right */}
          <div className="md:hidden divide-y divide-white/10">
            {rows.map((r, i) => (
              <div key={i} className="px-4 py-3">
                {/* top row: job title left, status badge right */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <ClipboardCheck className="h-4 w-4 text-white/50" />
                    <div className="truncate text-white">{r.title}</div>
                  </div>
                  <span className="ml-auto shrink-0 inline-flex items-center rounded-md border border-emerald-400/40 bg-emerald-400/10 text-emerald-200 px-2 py-0.5 text-[11px]">
                    {r.status}
                  </span>
                </div>

                {/* meta line */}
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

          {/* DESKTOP (md+): classic 5-column grid; status far right */}
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-full grid text-sm grid-cols-[1fr_120px_120px_160px_100px]">
              {/* Header */}
              <div className="px-4 py-2 text-white/60 border-b border-white/10">
                Job
              </div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">
                Date
              </div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">
                Time
              </div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">
                Customer
              </div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">
                Status
              </div>

              {/* Rows */}
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
                    <span className="inline-flex items-center rounded-md border border-emerald-400/40 bg-emerald-400/10 text-emerald-200 px-2 py-0.5 text-xs">
                      {r.status}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
