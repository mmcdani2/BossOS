// src/features/billing/Billing.tsx
import React from "react";
import { Filter, Search, ReceiptText } from "lucide-react";
import ViewToolbar from "@/ui/ViewToolbar";
import UiSelect from "@/ui/UiSelect";
import ListViewLayout from "@/features/common/components/ListViewLayout";

type InvoiceRow = {
  id: string;
  customer: string;
  amount: string;
  status: "Overdue" | "Paid" | "Open";
  badgeClasses: string;
};

export default function Billing() {
  // demo rows; replace with real data
  const rows: InvoiceRow[] = Array.from({ length: 30 }).map((_, i) => ({
    id: `INV-10${i + 12}`,
    customer: "Acme Corp",
    amount: `$${(1260 + i * 15).toLocaleString()}.00`,
    status: (i % 3 === 0 ? "Overdue" : i % 3 === 1 ? "Paid" : "Open") as InvoiceRow["status"],
    badgeClasses:
      i % 3 === 0
        ? "border-rose-400/40 bg-rose-400/10 text-rose-200"
        : i % 3 === 1
          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
          : "border-amber-400/40 bg-amber-400/10 text-amber-200",
  }));

  const [invStatus, setInvStatus] = React.useState("all");

  const actions = [
    {
      id: "new-invoice",
      label: "New Invoice",
      onClick: () => {
        /* open modal */
      },
    },
  ];

  // Sticky search + filters bar (unchanged markup moved here)
  const filterBar = (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <ViewToolbar
          label={
            <div className="relative min-w-[260px] max-w-[480px] w-full">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
              <input
                placeholder="Search invoices, address, customer…"
                className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
              />
            </div>
          }
          right={
            <div className="flex items-center gap-2 min-w-0 justify-end" style={{ whiteSpace: "nowrap", overflowX: "auto" }}>
              <style>{`.toolbar > div::-webkit-scrollbar{display:none}`}</style>
              <button className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white shrink-0">
                <Filter className="h-4 w-4" /> Filters
              </button>
              <div className="flex items-center gap-2 text-white/60 text-sm shrink-0">
                <span>Status:</span>
                <UiSelect
                  value={invStatus}
                  onChange={setInvStatus}
                  width={140}
                  options={[
                    { label: "All", value: "all" },
                    { label: "Open", value: "open" },
                    { label: "Paid", value: "paid" },
                    { label: "Overdue", value: "overdue" },
                  ]}
                />
              </div>
            </div>
          }
        />
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-2">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
          <input
            placeholder="Search invoices, address, customer…"
            className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <div className="flex items-center justify-end gap-2 text-white/60 text-sm">
            <span className="hidden xs:inline">Status:</span>
            <UiSelect
              value={invStatus}
              onChange={setInvStatus}
              width="100%"
              options={[
                { label: "All", value: "all" },
                { label: "Open", value: "open" },
                { label: "Paid", value: "paid" },
                { label: "Overdue", value: "overdue" },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <ListViewLayout title="Invoices" filterBar={filterBar} actions={actions}>
      {/* Your EXACT list block — unchanged */}
      <div className="panel mt-8" style={{ flex: 1, minHeight: 0 }}>
        <div className="panel-scroll">
          {/* Sticky header inside the scroller */}
          <div className="panel-header panel-header--frost hidden md:grid grid-cols-[1fr_160px_140px_120px]">
            <div className="px-4 py-2 text-white/60">Invoice</div>
            <div className="px-4 py-2 text-white/60">Customer</div>
            <div className="px-4 py-2 text-white/60">Amount</div>
            <div className="px-4 py-2 text-white/60">Status</div>
          </div>

          {/* MOBILE list */}
          <div className="md:hidden divide-y divide-white/10">
            {rows.map((r) => (
              <div key={r.id} className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <ReceiptText className="h-4 w-4 text-white/50" />
                    <div className="truncate text-white">{r.id}</div>
                  </div>
                  <span className={`ml-auto shrink-0 inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] ${r.badgeClasses}`}>
                    {r.status}
                  </span>
                </div>
                <div className="mt-1 text-white/70 text-xs flex items-center gap-2">
                  <span className="truncate">{r.customer}</span>
                  <span className="opacity-50">•</span>
                  <span>{r.amount}</span>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP rows */}
          <div className="hidden md:grid text-sm grid-cols-[1fr_160px_140px_120px]">
            {rows.map((r) => (
              <React.Fragment key={r.id}>
                <div className="px-4 py-3 text-white border-b border-white/10 flex items-center gap-2 min-w-0">
                  <ReceiptText className="h-4 w-4 text-white/50" />
                  <span className="truncate">{r.id}</span>
                </div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">{r.customer}</div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">{r.amount}</div>
                <div className="px-4 py-3 border-b border-white/10">
                  <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${r.badgeClasses}`}>{r.status}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </ListViewLayout>
  );
}
