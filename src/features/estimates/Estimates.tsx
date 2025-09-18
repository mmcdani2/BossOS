import { Plus, Filter, Search, FileText } from "lucide-react";
import PageHeader from "../../ui/PageHeader";
import GlassCard from "../../ui/GlassCard";
import React from "react";

export default function Estimates() {
  return (
    <div className="sticky top-[var(--nav-h)] z-10 -mx-3 px-3 py-3 bg-black/30 backdrop-blur border-b border-white/10">
      <PageHeader
        title="Estimates"
        subtitle="Quotes awaiting approval and recent activity"
        action={
          <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white">
            <Plus className="h-4 w-4" /> New Estimate
          </button>
        }
      />

      <div className="max-w-[1200px] mx-auto mt-4 space-y-4">
        {/* Filters */}
        <GlassCard className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
              <input placeholder="Search estimates…" className="pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"/>
            </div>
            <button className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white">
              <Filter className="h-4 w-4" /> Status
            </button>
            <div className="ml-auto text-sm text-white/60">This month</div>
          </div>
        </GlassCard>

        {/* Table */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_140px_120px] text-sm">
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Estimate</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Customer</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Amount</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Status</div>
            {Array.from({ length: 5 }).map((_, i) => (
              <React.Fragment key={i}>
                <div className="px-4 py-3 text-white border-b border-white/10 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-white/50" />
                  System replacement proposal
                </div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">Acme Corp</div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">$7,860.00</div>
                <div className="px-4 py-3 border-b border-white/10">
                  <span className="inline-flex items-center rounded-md border border-amber-400/40 bg-amber-400/10 text-amber-200 px-2 py-0.5 text-xs">Pending</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
