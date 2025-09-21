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

      <section className="w-full">
        <div className="shell page-viewport">
          {/* Toolbar #1 — glass look, sticky under header */}
          <div
            className="sticky-under-nav"
            style={{ top: "calc(var(--nav-h) - 64px)" }}
          >
            <GlassCard className="p-3">
              <ViewToolbar
                label="Jobs"
                right={
                  <button
                    title="New Job"
                    className="px-2.5 py-1.5 text-xs leading-none rounded-[9px] text-slate-200
                             border border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30
                             active:translate-y-px inline-flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">New Job</span>
                  </button>
                }
              />
            </GlassCard>
          </div>

          {/* Toolbar #2 — glass look with Search + Filters (responsive) */}
          <div
            className="z-50"
            style={{
              position: "sticky",
              top: "calc(34px + var(--toolbar-h, 56px))",
            }}
          >
            <GlassCard className="p-3">
              {/* Desktop / Tablet */}
              <div className="hidden md:block">
                <ViewToolbar
                  label={
                    // search on the LEFT (label column)
                    <div className="relative min-w-[260px] max-w-[480px] w-full">
                      <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
                      <input
                        placeholder="Search jobs, address, customer…"
                        className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
                      />
                    </div>
                  }
                  right={
                    // controls stay on the RIGHT (auto column)
                    <div
                      className="flex items-center gap-2 min-w-0 justify-end"
                      style={{ whiteSpace: "nowrap", overflowX: "auto" }}
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
                  }
                />
              </div>

              {/* Mobile: search full-width, then 2-up row: Filters | Status */}
              <div className="md:hidden">
                <div className="space-y-2">
                  {/* row 1: search */}
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
                    <input
                      placeholder="Search jobs, address, customer…"
                      className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
                    />
                  </div>

                  {/* row 2: 2 columns */}
                  <div className="grid grid-cols-2 gap-2">
                    <button className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white">
                      <Filter className="h-4 w-4" /> Filters
                    </button>

                    <div className="flex items-center justify-end gap-2 text-white/60 text-sm">
                      <span className="hidden xs:inline">Status:</span>
                      <select className="h-9 w-full rounded-md border border-white/10 bg-white/5 text-white px-2">
                        <option>All</option>
                        <option>Scheduled</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Jobs list (same as yours) */}
          <div
            className="jobs-container mt-8"
            style={{ flex: 1, minHeight: 0 }}
          >
            <div className="jobs-scroll">
              <div className="jobs-header hidden md:grid grid-cols-[1fr_120px_120px_160px_120px]">
                <div className="px-4 py-2 text-white/60">Job</div>
                <div className="px-4 py-2 text-white/60">Date</div>
                <div className="px-4 py-2 text-white/60">Time</div>
                <div className="px-4 py-2 text-white/60">Customer</div>
                <div className="px-4 py-2 text-white/60">Status</div>
              </div>

              {/* MOBILE list */}
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

              {/* DESKTOP rows */}
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
      </section>
    </>
  );
}
