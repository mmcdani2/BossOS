import { Plus, Filter, Search, ReceiptText } from "lucide-react";
import PageHeader from "../../ui/PageHeader";
import GlassCard from "../../ui/GlassCard";
import React from "react";


export default function Billing() {
  return (
    <div className="route-root px-3 pb-6">
      <PageHeader
        title="Invoices"
        subtitle="Open balances and recent payments"
        action={
          <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white">
            <Plus className="h-4 w-4" /> New Invoice
          </button>
        }
      />

      <div className="max-w-[1200px] mx-auto mt-4 space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
        <GlassCard className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
              <input placeholder="Search invoices…" className="pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"/>
            </div>
            <button className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white">
              <Filter className="h-4 w-4" /> Status
            </button>
            <div className="ml-auto text-sm text-white/60">Due: Next 14 days</div>
          </div>
        </GlassCard>

        {/* Table */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_140px_120px] text-sm">
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Invoice</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Customer</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Amount</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Status</div>

            {Array.from({ length: 5 }).map((_, i) => (
              <React.Fragment key={i}>
                <div className="px-4 py-3 text-white border-b border-white/10 flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-white/50" />
                  INV-10{i + 12}
                </div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">Acme Corp</div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">$1,260.00</div>
                <div className="px-4 py-3 border-b border-white/10">
                  <span className="inline-flex items-center rounded-md border border-rose-400/40 bg-rose-400/10 text-rose-200 px-2 py-0.5 text-xs">Overdue</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
