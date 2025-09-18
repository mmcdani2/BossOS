import { Boxes, Search, Plus } from "lucide-react";
import PageHeader from "../../ui/PageHeader";
import GlassCard from "../../ui/GlassCard";
import React from "react";

export default function Inventory() {
  return (
    <div className="sticky top-[var(--nav-h)] z-10 -mx-3 px-3 py-3 bg-black/30 backdrop-blur border-b border-white/10">
      <PageHeader
        title="Inventory"
        subtitle="Parts and materials on hand"
        action={
          <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white">
            <Plus className="h-4 w-4" /> Add Item
          </button>
        }
      />

      <div className="max-w-[1200px] mx-auto mt-4 space-y-4">
        {/* Search */}
        <GlassCard className="p-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
            <input placeholder="Search SKU, name, or location…" className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"/>
          </div>
        </GlassCard>

        {/* Table */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_120px_140px] text-sm">
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Item</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">SKU</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">On Hand</div>
            <div className="px-4 py-2 text-white/60 border-b border-white/10">Location</div>

            {Array.from({ length: 6 }).map((_, i) => (
              <React.Fragment key={i}>
                <div className="px-4 py-3 text-white border-b border-white/10 flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-white/50" />
                  Condenser fan motor
                </div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">CFM-200{i}</div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">12</div>
                <div className="px-4 py-3 text-white/80 border-b border-white/10">Truck 2</div>
              </React.Fragment>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
