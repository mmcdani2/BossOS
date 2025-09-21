// src/features/customers/Customers.tsx
import React from "react";
import { Users, Search, Plus, Filter } from "lucide-react";
import PageHeader from "@/ui/PageHeader";
import ViewToolbar from "@/ui/ViewToolbar";
import GlassCard from "@/ui/GlassCard";

type CustomerRow = {
  name: string;
  email: string;
  phone: string;
  meta: string; // e.g., "Last job: Jul 14 · Balance: $0.00"
};

export default function Customers() {
  // demo rows; replace with real data
  const rows: CustomerRow[] = Array.from({ length: 30 }).map((_, i) => ({
    name: `Acme Corp ${i + 1}`,
    email: "support@acme.com",
    phone: "(555) 123-4567",
    meta: "Last job: Jul 14 · Balance: $0.00",
  }));

  return (
    <>
      <PageHeader />

      <section className="w-full">
        <div className="shell page-viewport">
          {/* Toolbar #1 — glass, sticky under header */}
          <div
            className="sticky-under-nav"
            style={{ top: "calc(var(--nav-h) - 64px)" }}
          >
            <GlassCard className="p-3">
              <ViewToolbar
                label="Customers"
                right={
                  <button
                    title="New Customer"
                    className="px-2.5 py-1.5 text-xs leading-none rounded-[9px] text-slate-200
                               border border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30
                               active:translate-y-px inline-flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">New Customer</span>
                  </button>
                }
              />
            </GlassCard>
          </div>

          {/* Toolbar #2 — search + filters, sticky under toolbar #1 */}
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
                  // Search on the LEFT so it hugs the edge
                  label={
                    <div className="relative min-w-[260px] max-w-[480px] w-full">
                      <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
                      <input
                        placeholder="Search customers by name, phone, or email…"
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
                          <span>Status:</span>
                          <select className="h-9 rounded-md border border-white/10 bg-white/5 text-white px-2">
                            <option>All</option>
                            <option>Active</option>
                            <option>Prospect</option>
                            <option>Archived</option>
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
                    placeholder="Search customers by name, phone, or email…"
                    className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white">
                    <Filter className="h-4 w-4" /> Filters
                  </button>
                  <div className="flex items-center justify-end gap-2 text-white/60 text-sm">
                    <span className="hidden xs:inline">Status:</span>
                    <select className="h-9 w-full rounded-md border border-white/10 bg-white/5 text-white px-2">
                      <option>All</option>
                      <option>Active</option>
                      <option>Prospect</option>
                      <option>Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Customers list — reuse Jobs' chrome for rounded bottom + hidden scrollbar */}
          <div className="jobs-container mt-8" style={{ flex: 1, minHeight: 0 }}>
            <div className="jobs-scroll">
              {/* Sticky header inside the scroller */}
              <div className="jobs-header hidden md:grid grid-cols-[1fr_240px_160px_1fr]">
                <div className="px-4 py-2 text-white/60">Customer</div>
                <div className="px-4 py-2 text-white/60">Email</div>
                <div className="px-4 py-2 text-white/60">Phone</div>
                <div className="px-4 py-2 text-white/60">Meta</div>
              </div>

              {/* MOBILE list */}
              <div className="md:hidden divide-y divide-white/10">
                {rows.map((r, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-8 w-8 rounded-full border border-white/10 bg-white/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-white/70" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-white font-medium">{r.name}</div>
                          <div className="text-white/60 text-xs truncate">
                            {r.email} · {r.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 text-white/70 text-xs">
                      {r.meta}
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP rows */}
              <div className="hidden md:grid text-sm grid-cols-[1fr_240px_160px_1fr]">
                {rows.map((r, i) => (
                  <React.Fragment key={i}>
                    <div className="px-4 py-3 text-white border-b border-white/10 flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 rounded-full border border-white/10 bg-white/10 flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4 text-white/70" />
                      </div>
                      <span className="truncate">{r.name}</span>
                    </div>
                    <div className="px-4 py-3 text-white/80 border-b border-white/10 truncate">
                      {r.email}
                    </div>
                    <div className="px-4 py-3 text-white/80 border-b border-white/10">
                      {r.phone}
                    </div>
                    <div className="px-4 py-3 text-white/80 border-b border-white/10 truncate">
                      {r.meta}
                    </div>
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
