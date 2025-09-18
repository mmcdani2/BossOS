import { Users, Search, Plus } from "lucide-react";
import PageHeader from "../../ui/PageHeader";
import GlassCard from "../../ui/GlassCard";

export default function Customers() {
  return (
    <div className="sticky top-[var(--nav-h)] z-10 -mx-3 px-3 py-3 bg-black/30 backdrop-blur border-b border-white/10">
      <PageHeader
        title="Customers"
        subtitle="Accounts and contacts"
        action={
          <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white">
            <Plus className="h-4 w-4" /> New Customer
          </button>
        }
      />

      <div className="max-w-[1200px] mx-auto mt-4 space-y-4">
        {/* Search */}
        <GlassCard className="p-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2 top-2.5 text-white/50" />
            <input
              placeholder="Search customers by name, phone, or email…"
              className="w-full pl-8 pr-3 h-9 rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/50 outline-none focus:border-indigo-400/50"
            />
          </div>
        </GlassCard>

        {/* Grid cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <GlassCard key={i} className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-white/10 bg-white/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white/70" />
                </div>
                <div>
                  <div className="text-white font-medium">Acme Corp {i + 1}</div>
                  <div className="text-white/60 text-sm">support@acme.com · (555) 123-4567</div>
                </div>
              </div>
              <div className="mt-3 text-white/70 text-sm">Last job: Jul 14 · Balance: $0.00</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
