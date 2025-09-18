// src/features/inventory/Inventory.tsx
import React from "react";
import { Boxes, Search, Plus } from "lucide-react";
import PageHeader from "../../ui/PageHeader";
import ViewToolbar from "../../ui/ViewToolbar";
import GlassCard from "../../ui/GlassCard";

export default function Inventory() {
  // demo rows; replace with your data
  const rows = Array.from({ length: 6 }).map((_, i) => ({
    name: "Condenser fan motor",
    sku: `CFM-200${i}`,
    onHand: 12 - i,
    location: i % 2 ? "Truck 2" : "Warehouse A",
  }));

  return (
    <>
      {/* Global header (brand left, UserMenu right) */}
      <PageHeader />

      {/* Match Dashboard/Scheduler: everything under header sits in `.shell` */}
      <div className="shell pb-safe-bnav">
        {/* View toolbar — title left, actions right */}
        <ViewToolbar
          label="Inventory"
          right={
            <button className="dt-refresh" title="Add Item">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Item</span>
            </button>
          }
        />

        {/* Search */}
        <GlassCard className="p-3 mt-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
            <input
              placeholder="Search SKU, name, or location…"
              className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
            />
          </div>
        </GlassCard>

        {/* List */}
        <GlassCard className="p-0 overflow-hidden mt-4">
          {/* MOBILE (< md): stacked cards, qty badge pinned far right */}
          <div className="md:hidden divide-y divide-white/10">
            {rows.map((r, i) => (
              <div key={i} className="px-4 py-3">
                {/* top row: item left, qty badge right */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Boxes className="h-4 w-4 text-white/50" />
                    <div className="truncate text-white">{r.name}</div>
                  </div>
                  <span className="ml-auto shrink-0 inline-flex items-center rounded-md border border-indigo-400/40 bg-indigo-400/10 text-indigo-200 px-2 py-0.5 text-[11px]">
                    {r.onHand} on hand
                  </span>
                </div>

                {/* meta line */}
                <div className="mt-1 text-white/70 text-xs flex items-center gap-2">
                  <span className="truncate">{r.sku}</span>
                  <span className="opacity-50">•</span>
                  <span className="truncate">{r.location}</span>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP (md+): 4-column grid */}
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-full grid text-sm grid-cols-[1fr_120px_120px_140px]">
              {/* Header */}
              <div className="px-4 py-2 text-white/60 border-b border-white/10">
                Item
              </div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">
                SKU
              </div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">
                On Hand
              </div>
              <div className="px-4 py-2 text-white/60 border-b border-white/10">
                Location
              </div>

              {/* Rows */}
              {rows.map((r, i) => (
                <React.Fragment key={i}>
                  <div className="px-4 py-3 text-white border-b border-white/10 flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-white/50" />
                    <span className="truncate">{r.name}</span>
                  </div>
                  <div className="px-4 py-3 text-white/80 border-b border-white/10">
                    {r.sku}
                  </div>
                  <div className="px-4 py-3 text-white/80 border-b border-white/10">
                    {r.onHand}
                  </div>
                  <div className="px-4 py-3 text-white/80 border-b border-white/10">
                    {r.location}
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
