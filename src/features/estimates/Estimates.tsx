/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/estimates/Estimates.tsx
import React from "react";
import {
  Plus,
  Filter,
  Search,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import PageHeader from "../../ui/PageHeader";
import ViewToolbar from "../../ui/ViewToolbar";
import GlassCard from "../../ui/GlassCard";

type EstStatus = "Pending" | "Accepted" | "Declined";

const STATUS_STYLES: Record<
  EstStatus,
  { badge: string; Icon: React.ComponentType<any> }
> = {
  Pending: {
    badge: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    Icon: Clock,
  },
  Accepted: {
    badge: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    Icon: CheckCircle2,
  },
  Declined: {
    badge: "border-rose-400/40 bg-rose-400/10 text-rose-200",
    Icon: XCircle,
  },
};

export default function Estimates() {
  // demo rows; replace with real data
  const rows = [
    { title: "System replacement proposal", customer: "Acme Corp", amount: "$7,860.00", status: "Pending" as EstStatus },
    { title: "Duct sealing estimate", customer: "Blue Sky LLC", amount: "$1,240.00", status: "Accepted" as EstStatus },
    { title: "Thermostat install", customer: "Sunset Homes", amount: "$420.00", status: "Declined" as EstStatus },
    { title: "Mini-split addition", customer: "Orbit Studios", amount: "$3,110.00", status: "Pending" as EstStatus },
    { title: "Annual maintenance plan", customer: "Beacon Realty", amount: "$980.00", status: "Accepted" as EstStatus },
  ];

  return (
    <>
      {/* Global header (brand left, UserMenu right) */}
      <PageHeader />

      {/* Match Dashboard/Scheduler: everything under header sits in `.shell` */}
      <div className="shell pb-safe-bnav">
        {/* View toolbar — title left, actions right */}
        <ViewToolbar
          label="Estimates"
          right={
            <button className="dt-refresh" title="New Estimate">
              <Plus className="h-4 w-4" />
              <span className="sr-only">New Estimate</span>
            </button>
          }
        />

        {/* Filters (one-line: search left, controls pinned right) */}
        <GlassCard className="p-3 mt-4">
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
                placeholder="Search estimates…"
                className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
              />
            </div>

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
                <Filter className="h-4 w-4" /> Status
              </button>
              <div className="text-sm text-white/60 shrink-0">This month</div>
            </div>
          </div>
        </GlassCard>

        {/* List */}
        <GlassCard className="p-0 overflow-hidden mt-4">
          {/* MOBILE (< md): stacked cards, status badge + icon pinned far right */}
          <div className="md:hidden divide-y divide-white/10">
            {rows.map((r, i) => {
              const { badge, Icon } = STATUS_STYLES[r.status];
              return (
                <div key={i} className="px-4 py-3">
                  {/* top row: title left, status badge right */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-white/50" />
                      <div className="truncate text-white">{r.title}</div>
                    </div>
                    <span
                      className={`ml-auto shrink-0 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] ${badge}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {r.status}
                    </span>
                  </div>

                  {/* meta line */}
                  <div className="mt-1 text-white/70 text-xs flex items-center gap-2">
                    <span className="truncate">{r.customer}</span>
                    <span className="opacity-50">•</span>
                    <span>{r.amount}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP (md+): 4-column grid; status rightmost with icon */}
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-full grid text-sm grid-cols-[1fr_160px_140px_140px]">
              {/* Header */}
              <div className="px-4 py-2 text-white/60 border-b border-white/10">Estimate</div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">Customer</div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">Amount</div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">Status</div>

              {/* Rows */}
              {rows.map((r, i) => {
                const { badge, Icon } = STATUS_STYLES[r.status];
                return (
                  <React.Fragment key={i}>
                    <div className="px-4 py-3 text-white border-b border-white/10 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-white/50" />
                      <span className="truncate">{r.title}</span>
                    </div>
                    <div className="px-4 py-3 text-white/80 border-b border-white/10">
                      {r.customer}
                    </div>
                    <div className="px-4 py-3 text-white/80 border-b border-white/10">
                      {r.amount}
                    </div>
                    <div className="px-4 py-3 border-b border-white/10">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${badge}`}
                      >
                        <Icon className="h-4 w-4" />
                        {r.status}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
