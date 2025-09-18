import { Plus, Filter, Search, ClipboardCheck } from "lucide-react";
import PageHeader from "../../ui/PageHeader";
import GlassCard from "../../ui/GlassCard";
import React from "react";

export default function Jobs() {
  return (
    <div className="sticky top-[var(--nav-h)] z-10 -mx-3 px-3 py-3 bg-black/30 backdrop-blur border-b border-white/10">
      <PageHeader
        title="Jobs"
        subtitle="Active work orders and past visits"
        action={
          <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white">
            <Plus className="h-4 w-4" /> New Job
          </button>
        }
      />

      <div className="max-w-[1200px] mx-auto mt-4 space-y-4">
        {/* Filters */}
        <GlassCard className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
              <input
                placeholder="Search jobs, address, customer…"
                className="pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
              />
            </div>
            <button className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white">
              <Filter className="h-4 w-4" /> Filters
            </button>
            <div className="ml-auto flex items-center gap-2 text-white/60 text-sm">
              <span>Status:</span>
              <select className="h-9 rounded-md border border-white/10 bg-white/5 text-white px-2">
                <option>All</option><option>Scheduled</option><option>In Progress</option><option>Completed</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ["Scheduled", "12"],
            ["In Progress", "4"],
            ["Completed today", "18"],
            ["Overdue", "2"],
          ].map(([label, value]) => (
            <GlassCard key={label} className="p-4">
              <div className="text-white/60 text-xs">{label}</div>
              <div className="text-white text-xl font-semibold mt-1">{value}</div>
            </GlassCard>
          ))}
        </div>

        {/* List */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_120px_160px_100px] gap-0 text-sm">
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Job</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Date</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Time</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Customer</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Status</div>

            {/* row (sample) */}
            {Array.from({ length: 5 }).map((_, i) => (
              <React.Fragment key={i}>
                <div className="px-4 py-3 text-white border-b border-white/10 flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-white/50" />
                  Replace condensing unit
                </div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">Jul 24</div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">9:00–10:30a</div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">Acme Corp</div>
                <div className="px-4 py-3 border-b border-white/10">
                  <span className="inline-flex items-center rounded-md border border-emerald-400/40 bg-emerald-400/10 text-emerald-200 px-2 py-0.5 text-xs">Scheduled</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
