// src/features/inventory/Inventory.tsx
import React from "react";
import { Boxes, Search, Plus, Filter } from "lucide-react";
import PageHeader from "@/ui/PageHeader";
import ViewToolbar from "@/ui/ViewToolbar";
import GlassCard from "@/ui/GlassCard";

type Row = {
  name: string;
  sku: string;
  onHand: number;
  location: string;
};

export default function Inventory() {
  // demo rows; replace with real data
  const rows: Row[] = Array.from({ length: 40 }).map((_, i) => ({
    name: `Condenser fan motor ${i + 1}`,
    sku: `CFM-20${i.toString().padStart(2, "0")}`,
    onHand: Math.max(0, 24 - i),
    location: i % 3 === 0 ? "Warehouse A" : i % 3 === 1 ? "Truck 2" : "Warehouse B",
  }));

  return (
    <>
      <PageHeader />

      <section className="w-full">
        <div className="shell page-viewport">
          {/* Toolbar #1 — glass, sticky under PageHeader */}
          <div
            className="sticky-under-nav"
            style={{ top: "calc(var(--nav-h) - 64px)" }}
          >
            <GlassCard className="p-3">
              <ViewToolbar
                label="Inventory"
                right={
                  <button
                    className="px-2.5 py-1.5 text-xs leading-none rounded-[9px] text-slate-200
                               border border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30
                               active:translate-y-px inline-flex items-center gap-2"
                    title="Add Item"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add Item</span>
                  </button>
                }
              />
            </GlassCard>
          </div>

          {/* Toolbar #2 — search + filters, sticky below toolbar #1 */}
          <div
            className="z-50"
            style={{
              position: "sticky",
              top: "calc(34px + var(--toolbar-h, 56px))",
            }}
          >
            <GlassCard className="p-3">
              {/* Desktop */}
              <div className="hidden md:block">
                <ViewToolbar
                  label={
                    <div className="relative min-w-[260px] max-w-[480px] w-full">
                      <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
                      <input
                        placeholder="Search SKU, name, or location…"
                        className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
                      />
                    </div>
                  }
                  right={
                    <>
                      <style>{`.dash-toolbar > div::-webkit-scrollbar{display:none}`}</style>
                      <div
                        className="flex items-center gap-2 min-w-0 justify-end"
                        style={{ whiteSpace: "nowrap", overflowX: "auto" }}
                      >
                        <button className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white shrink-0">
                          <Filter className="h-4 w-4" /> Filters
                        </button>
                        <div className="flex items-center gap-2 text-white/60 text-sm shrink-0">
                          <span>Location:</span>
                          <select className="h-9 rounded-md border border-white/10 bg-white/5 text-white px-2">
                            <option>All</option>
                            <option>Warehouse A</option>
                            <option>Warehouse B</option>
                            <option>Truck 1</option>
                            <option>Truck 2</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 text-sm shrink-0">
                          <span>Stock:</span>
                          <select className="h-9 rounded-md border border-white/10 bg-white/5 text-white px-2">
                            <option>All</option>
                            <option>Low (&lt;5)</option>
                            <option>Out of stock</option>
                          </select>
                        </div>
                      </div>
                    </>
                  }
                />
              </div>

              {/* Mobile: stacked */}
              <div className="md:hidden space-y-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
                  <input
                    placeholder="Search SKU, name, or location…"
                    className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white">
                    <Filter className="h-4 w-4" /> Filters
                  </button>
                  <select className="h-9 rounded-md border border-white/10 bg-white/5 text-white px-2">
                    <option>All Locations</option>
                    <option>Warehouse A</option>
                    <option>Warehouse B</option>
                    <option>Truck 1</option>
                    <option>Truck 2</option>
                  </select>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Inventory list — reuse Jobs' chrome for rounded bottom + hidden scrollbar */}
          <div className="jobs-container mt-8" style={{ flex: 1, minHeight: 0 }}>
            <div className="jobs-scroll">
              {/* Sticky header inside the scroller */}
              <div className="jobs-header hidden md:grid grid-cols-[1fr_160px_120px_160px]">
                <div className="px-4 py-2 text-white/60">Item</div>
                <div className="px-4 py-2 text-white/60">SKU</div>
                <div className="px-4 py-2 text-white/60">On Hand</div>
                <div className="px-4 py-2 text-white/60">Location</div>
              </div>

              {/* MOBILE list (cards) */}
              <div className="md:hidden divide-y divide-white/10">
                {rows.map((r, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Boxes className="h-4 w-4 text-white/50" />
                        <div className="truncate text-white">{r.name}</div>
                      </div>
                      <span className="ml-auto shrink-0 inline-flex items-center rounded-md border border-indigo-400/40 bg-indigo-400/10 text-indigo-200 px-2 py-0.5 text-[11px]">
                        {r.onHand} on hand
                      </span>
                    </div>
                    <div className="mt-1 text-white/70 text-xs flex items-center gap-2">
                      <span className="truncate">{r.sku}</span>
                      <span className="opacity-50">•</span>
                      <span className="truncate">{r.location}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP rows */}
              <div className="hidden md:grid text-sm grid-cols-[1fr_160px_120px_160px]">
                {rows.map((r, i) => (
                  <React.Fragment key={i}>
                    <div className="px-4 py-3 text-white border-b border-white/10 flex items-center gap-2 min-w-0">
                      <Boxes className="h-4 w-4 text-white/50" />
                      <span className="truncate">{r.name}</span>
                    </div>
                    <div className="px-4 py-3 text-white/80 border-b border-white/10">{r.sku}</div>
                    <div className="px-4 py-3 text-white/80 border-b border-white/10">{r.onHand}</div>
                    <div className="px-4 py-3 text-white/80 border-b border-white/10">{r.location}</div>
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
