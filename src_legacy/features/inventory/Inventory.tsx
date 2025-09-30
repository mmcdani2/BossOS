// src/features/inventory/Inventory.tsx
import React from "react";
import { Boxes, Search, Filter } from "lucide-react";
import ViewToolbar from "@/ui/ViewToolbar";
import UiSelect from "@/ui/UiSelect";
import ListViewLayout from "@/features/common/components/ListViewLayout";

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

  const [loc, setLoc] = React.useState("all");
  const [stock, setStock] = React.useState("all");

  const actions = [
    {
      id: "add-item",
      label: "Add Item",
      onClick: () => {
      },
    },
  ];

  // Sticky search + filters bar (unchanged markup)
  const filterBar = (
    <>
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
              <style>{`.toolbar > div::-webkit-scrollbar{display:none}`}</style>
              <div
                className="flex items-center gap-2 min-w-0 justify-end"
                style={{ whiteSpace: "nowrap", overflowX: "auto" }}
              >
                <button className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white shrink-0">
                  <Filter className="h-4 w-4" /> Filters
                </button>

                <div className="flex items-center gap-2 text-white/60 text-sm shrink-0">
                  <span>Location:</span>
                  <UiSelect
                    value={loc}
                    onChange={setLoc}
                    width={160}
                    options={[
                      { label: "All", value: "all" },
                      { label: "Warehouse A", value: "wa" },
                      { label: "Warehouse B", value: "wb" },
                      { label: "Truck 1", value: "t1" },
                      { label: "Truck 2", value: "t2" },
                    ]}
                  />
                </div>

                <div className="flex items-center gap-2 text-white/60 text-sm shrink-0">
                  <span>Stock:</span>
                  <UiSelect
                    value={stock}
                    onChange={setStock}
                    width={150}
                    options={[
                      { label: "All", value: "all" },
                      { label: "Low (<5)", value: "low" },
                      { label: "Out of stock", value: "out" },
                    ]}
                  />
                </div>
              </div>
            </>
          }
        />
      </div>

      {/* Mobile: stacked */}
      <div className="md:hidden space-y-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* search box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
            <input
              placeholder="Search SKU, name, or location…"
              className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 
                 text-white placeholder:text-white/50 outline-none 
                 focus:border-indigo-400/50"
            />
          </div>

          {/* filter button */}
          <button
            className="inline-flex items-center gap-2 h-9 px-3 rounded-md 
               border border-white/10 bg-white/5 hover:bg-white/10 
               text-white shrink-0"
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <UiSelect
            value={loc}
            onChange={setLoc}
            width="100%"
            options={[
              { label: "All Locations", value: "all" },
              { label: "Warehouse A", value: "wa" },
              { label: "Warehouse B", value: "wb" },
              { label: "Truck 1", value: "t1" },
              { label: "Truck 2", value: "t2" },
            ]}
          />
          <UiSelect
            value={stock}
            onChange={setStock}
            width="100%"
            options={[
              { label: "All Stock", value: "all" },
              { label: "Low (<5)", value: "low" },
              { label: "Out of stock", value: "out" },
            ]}
          />
        </div>
      </div>
    </>
  );

  return (
    <ListViewLayout title="Inventory" filterBar={filterBar} actions={actions}>
      {/* Your EXACT list block — unchanged */}
      <div className="panel mt-8" style={{ flex: 1, minHeight: 0 }}>
        <div className="panel-scroll">
          {/* Sticky header inside the scroller */}
          <div className="panel-header panel-header--frost hidden md:grid grid-cols-[1fr_160px_120px_160px]">
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
    </ListViewLayout>
  );
}
