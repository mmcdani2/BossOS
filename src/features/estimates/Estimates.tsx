// src/features/estimates/Estimates.tsx
import React from "react";
import { Filter, Search, FileText } from "lucide-react";
import ViewToolbar from "@/ui/ViewToolbar";
import UiSelect from "@/ui/UiSelect";
import ListViewLayout from "@/features/common/components/ListViewLayout";

type EstimateStatus = "Draft" | "Sent" | "Accepted" | "Declined";

export default function Estimates() {
  // demo rows; replace with real data
  const rows = Array.from({ length: 40 }).map((_, i) => ({
    title: `Estimate #${1000 + i}`,
    date: "Aug 24",
    amount: 2500 + i * 25,
    customer: "Acme Corp",
    status: (i % 4 === 0
      ? "Draft"
      : i % 4 === 1
        ? "Sent"
        : i % 4 === 2
          ? "Accepted"
          : "Declined") as EstimateStatus,
  }));

  const fmtMoney = (n: number) => `$${n.toLocaleString()}`;
  const [estStatus, setEstStatus] = React.useState("all");

  const actions = [
    {
      id: "new-estimate",
      label: "New Estimate",
      onClick: () => {
        /* open modal */
      },
    },
  ];

  // Sticky Search + Filters (unchanged markup)
  const filterBar = (
    <>
      {/* Desktop / Tablet */}
      <div className="hidden md:block">
        <ViewToolbar
          label={
            <div className="relative min-w-[260px] max-w-[480px] w/full">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
              <input
                placeholder="Search estimates, address, customer…"
                className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
              />
            </div>
          }
          right={
            <>
              <style>{`.toolbar > div::-webkit-scrollbar{display:none}`}</style>
              <div
                className="flex items-center gap-2 min-w-0 justify-end"
                style={{ whiteSpace: "nowrap", overflowX: "auto" }}
              >
                <button className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white shrink-0">
                  <Filter className="h-4 w-4" /> Filters
                </button>

                <div className="flex items-center gap-2 text-white/60 text-sm shrink-0">
                  <span>Status:</span>
                  <UiSelect
                    value={estStatus}
                    onChange={setEstStatus}
                    width={140}
                    options={[
                      { label: "All", value: "all" },
                      { label: "Draft", value: "draft" },
                      { label: "Sent", value: "sent" },
                      { label: "Accepted", value: "accepted" },
                      { label: "Declined", value: "declined" },
                    ]}
                  />
                </div>
              </div>
            </>
          }
        />
      </div>

      {/* Mobile: stacked, full-width */}
      <div className="md:hidden space-y-2">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
          <input
            placeholder="Search estimates, address, customer…"
            className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <div className="flex items-center gap-2 text-white/60 text-sm shrink-0">
            <span>Status:</span>
            <UiSelect
              value={estStatus}
              onChange={setEstStatus}
              width={140}
              options={[
                { label: "All", value: "all" },
                { label: "Draft", value: "draft" },
                { label: "Sent", value: "sent" },
                { label: "Accepted", value: "accepted" },
                { label: "Declined", value: "declined" },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <ListViewLayout title="Estimates" filterBar={filterBar} actions={actions}>
      {/* Your EXACT list block — unchanged */}
      <div className="panel mt-8" style={{ flex: 1, minHeight: 0 }}>
        <div className="panel-scroll">
          {/* Sticky header inside scroller */}
          <div className="panel-header panel-header--frost hidden md:grid grid-cols-[1fr_140px_160px_160px_120px]">
            <div className="px-4 py-2 text-white/60">Estimate</div>
            <div className="px-4 py-2 text-white/60">Date</div>
            <div className="px-4 py-2 text-white/60">Amount</div>
            <div className="px-4 py-2 text-white/60">Customer</div>
            <div className="px-4 py-2 text-white/60">Status</div>
          </div>

          {/* MOBILE list */}
          <div className="md:hidden divide-y divide-white/10">
            {rows.map((r, i) => (
              <div key={i} className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-white/50" />
                    <div className="truncate text-white">{r.title}</div>
                  </div>
                  <span
                    className={`ml-auto shrink-0 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] border ${r.status === "Accepted"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                        : r.status === "Declined"
                          ? "border-rose-400/40 bg-rose-400/10 text-rose-200"
                          : r.status === "Sent"
                            ? "border-sky-400/40 bg-sky-400/10 text-sky-200"
                            : "border-zinc-400/40 bg-zinc-400/10 text-zinc-200"
                      }`}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="mt-1 text-white/70 text-xs flex items-center gap-2">
                  <span>{r.date}</span>
                  <span className="opacity-50">•</span>
                  <span>{fmtMoney(r.amount)}</span>
                  <span className="opacity-50">•</span>
                  <span className="truncate">{r.customer}</span>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP rows */}
          <div className="hidden md:grid text-sm grid-cols-[1fr_140px_160px_160px_120px]">
            {rows.map((r, i) => (
              <React.Fragment key={i}>
                <div className="px-4 py-3 text-white border-b border-white/10 flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-white/50" />
                  <span className="truncate">{r.title}</span>
                </div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">{r.date}</div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">{fmtMoney(r.amount)}</div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">{r.customer}</div>
                <div className="px-4 py-3 border-b border-white/10">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs border ${r.status === "Accepted"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                        : r.status === "Declined"
                          ? "border-rose-400/40 bg-rose-400/10 text-rose-200"
                          : r.status === "Sent"
                            ? "border-sky-400/40 bg-sky-400/10 text-sky-200"
                            : "border-zinc-400/40 bg-zinc-400/10 text-zinc-200"
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
