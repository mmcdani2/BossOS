// src/features/billing/Billing.tsx
import React from "react";
import { Plus, Filter, Search, ReceiptText } from "lucide-react";
import PageHeader from "../../ui/PageHeader";
import ViewToolbar from "../../ui/ViewToolbar";
import GlassCard from "../../ui/GlassCard";

export default function Billing() {
  const rows = Array.from({ length: 12 }).map((_, i) => ({
    id: `INV-10${i + 12}`,
    customer: "Acme Corp",
    amount: "$1,260.00",
    status: i % 3 === 0 ? "Overdue" : i % 3 === 1 ? "Paid" : "Open",
    badgeClasses:
      i % 3 === 0
        ? "border-rose-400/40 bg-rose-400/10 text-rose-200"
        : i % 3 === 1
        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
        : "border-amber-400/40 bg-amber-400/10 text-amber-200",
  }));

  return (
    <>
      {/* Global header (brand left, UserMenu right) */}
      <PageHeader />

      {/* Match Dashboard/Scheduler: everything under header sits in `.shell` */}
      <div className="shell pb-safe-bnav">
        {/* View toolbar — title left, actions right */}
        <ViewToolbar
          label="Billing"
          right={
            <button className="dt-refresh" title="New Invoice">
              <Plus className="h-4 w-4" />
              <span className="sr-only">New Invoice</span>
            </button>
          }
        />

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            ["Open AR", "$12,340"],
            ["Overdue", "$2,180"],
            ["Paid (30d)", "$24,910"],
            ["Invoices (30d)", "46"],
          ].map(([label, value]) => (
            <GlassCard key={label} className="p-4">
              <div className="text-white/60 text-xs">{label}</div>
              <div className="text-white text-xl font-semibold mt-1">{value}</div>
            </GlassCard>
          ))}
        </div>

        {/* Filters */}
        <GlassCard className="p-3 mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
              <input
                placeholder="Search invoices…"
                className="pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
              />
            </div>
            <button className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white">
              <Filter className="h-4 w-4" /> Status
            </button>
            <div className="ml-auto text-sm text-white/60">Due: Next 14 days</div>
          </div>
        </GlassCard>

        {/* List */}
        <GlassCard className="p-0 overflow-hidden mt-4">
          {/* MOBILE (< md): stacked cards, status badge pinned far right */}
          <div className="md:hidden divide-y divide-white/10">
            {rows.map((r) => (
              <div key={r.id} className="px-4 py-3">
                {/* top row: invoice id left, status right */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <ReceiptText className="h-4 w-4 text-white/50" />
                    <div className="truncate text-white">{r.id}</div>
                  </div>
                  <span
                    className={`ml-auto shrink-0 inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] ${r.badgeClasses}`}
                  >
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
            ))}
          </div>

          {/* DESKTOP (md+): 4-column grid; status far right */}
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-full grid text-sm grid-cols-[1fr_160px_140px_120px]">
              {/* Header */}
              <div className="px-4 py-2 text-white/60 border-b border-white/10">Invoice</div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">Customer</div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">Amount</div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">Status</div>

              {/* Rows */}
              {rows.map((r) => (
                <React.Fragment key={r.id}>
                  <div className="px-4 py-3 text-white border-b border-white/10 flex items-center gap-2">
                    <ReceiptText className="h-4 w-4 text-white/50" />
                    <span className="truncate">{r.id}</span>
                  </div>
                  <div className="px-4 py-3 text-white/80 border-b border-white/10">
                    {r.customer}
                  </div>
                  <div className="px-4 py-3 text-white/80 border-b border-white/10">
                    {r.amount}
                  </div>
                  <div className="px-4 py-3 border-b border-white/10">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${r.badgeClasses}`}
                    >
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
