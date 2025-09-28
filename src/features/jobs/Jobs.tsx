// src/features/jobs/Jobs.tsx
import React from "react";
import { Filter, Search, ClipboardCheck } from "lucide-react";
import ViewToolbar from "../../ui/ViewToolbar";
import UiSelect from "@/ui/UiSelect";
import ListViewLayout from "@/features/common/components/ListViewLayout";

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

  const [status, setStatus] = React.useState("all");

  const actions = [
    {
      id: "new-job",
      label: "New Job",
      onClick: () => {
        /* open modal */
      },
    },
  ];

  // Sticky filter/search bar content (unchanged markup)
  const filterBar = (
    <>
      {/* Desktop / Tablet */}
      <div className="hidden md:block">
        <ViewToolbar
          label={
            // search on the LEFT
            <div className="relative min-w-[260px] max-w-[480px] w-full">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
              <input
                placeholder="Search jobs, address, customer…"
                className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
              />
            </div>
          }
          right={
            // controls on the RIGHT
            <div className="relative z-40 flex items-center justify-end min-w-0 overflow-visible">
              <div
                className="flex items-center gap-2 min-w-0 whitespace-nowrap overflow-x-auto"
                style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
              >
                <style>{`.toolbar > div::-webkit-scrollbar{display:none}`}</style>

                <button className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white shrink-0">
                  <Filter className="h-4 w-4" /> Filters
                </button>

                <div className="flex items-center gap-2 text-white/60 text-sm shrink-0">
                  <span>Status:</span>
                  <UiSelect
                    value={status}
                    onChange={setStatus}
                    width={140}
                    options={[
                      { label: "All", value: "all" },
                      { label: "Scheduled", value: "scheduled" },
                      { label: "In Progress", value: "inprogress" },
                      { label: "Completed", value: "completed" },
                    ]}
                  />
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* Mobile */}
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

            <div className="flex items-center gap-2 text-white/60 text-sm shrink-0">
              <span>Status:</span>
              <UiSelect
                value={status}
                onChange={setStatus}
                width={140}
                options={[
                  { label: "All", value: "all" },
                  { label: "Scheduled", value: "scheduled" },
                  { label: "In Progress", value: "inprogress" },
                  { label: "Completed", value: "completed" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <ListViewLayout
      title="Jobs"
      filterBar={filterBar}
      actions={actions}
    >
      <div className="panel mt-8" style={{ flex: 1, minHeight: 0 }}>
        <div className="panel-scroll">
          <div className="panel-header panel-header--frost hidden md:grid grid-cols-[1fr_120px_120px_160px_120px]">
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
                    className={`ml-auto shrink-0 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] border ${r.status === "Completed"
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
                <div className="px-4 py-3 text-white/80 border-b border-white/10">{r.date}</div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">{r.time}</div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">{r.customer}</div>
                <div className="px-4 py-3 border-b border-white/10">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs border ${r.status === "Completed"
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
    </ListViewLayout>
  );
}
