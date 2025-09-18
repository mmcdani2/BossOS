// src/features/customers/Customers.tsx
import React from "react";
import { Users, Search, Plus } from "lucide-react";
import PageHeader from "../../ui/PageHeader";
import ViewToolbar from "../../ui/ViewToolbar";
import GlassCard from "../../ui/GlassCard";

export default function Customers() {
  // demo list; replace with your data
  const rows = Array.from({ length: 6 }).map((_, i) => ({
    name: `Acme Corp ${i + 1}`,
    email: "support@acme.com",
    phone: "(555) 123-4567",
    meta: "Last job: Jul 14 · Balance: $0.00",
  }));

  return (
    <>
      {/* Global header (brand left, UserMenu right) */}
      <PageHeader />

      {/* Match Dashboard/Scheduler: everything under header sits in `.shell` */}
      <div className="shell pb-safe-bnav">
        {/* View toolbar — title left, actions right */}
        <ViewToolbar
          label="Customers"
          right={
            <button className="dt-refresh" title="New Customer">
              <Plus className="h-4 w-4" />
              <span className="sr-only">New Customer</span>
            </button>
          }
        />

        {/* Search */}
        <GlassCard className="p-3 mt-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
            <input
              placeholder="Search customers by name, phone, or email…"
              className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
            />
          </div>
        </GlassCard>

        {/* Grid cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {rows.map((r, i) => (
            <GlassCard key={i} className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-white/10 bg-white/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white/70" />
                </div>
                <div className="min-w-0">
                  <div className="text-white font-medium truncate">{r.name}</div>
                  <div className="text-white/60 text-sm truncate">
                    {r.email} · {r.phone}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-white/70 text-sm">{r.meta}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </>
  );
}
