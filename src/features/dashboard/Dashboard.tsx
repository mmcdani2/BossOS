import PageHeader from "../../ui/PageHeader";
import { useDashboardKPIs } from "./useDashboardKPIs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { DashboardFiltersProvider } from "@/features/dashboard/state/dashboardFilters";
import ViewToolbar from "@/ui/ViewToolbar";
import GlassCard from "@/ui/GlassCard";
import { useDashboardFilters } from "@/features/dashboard/state/dashboardFilters";
import { getOpenEstimatesValueInRange } from "@/lib/api/estimates";
import { getJobsCountInRange } from "@/lib/api/jobs";
import { getARBalanceInRange } from "@/lib/api/invoices";
import { getLeadsCountInRange } from "@/lib/api/leads";
import { DashboardKpiCard } from "@/ui/DashboardKpiCard";

function DashboardInner() {
  const { fromUtc, toUtc, refreshToken } = useDashboardFilters();

  const PRESETS = [
    { key: "today", label: "Today" },
    { key: "7d", label: "Last 7d" },
    { key: "30d", label: "Last 30d" },
    { key: "90d", label: "Last 90d" },
  ] as const;

  const { preset, setPreset, refresh } = useDashboardFilters();

  const {
    openEstimatesValue,
    jobsTodayCount,
    arBalance,
    leadsThisWeekCount,
    error,
  } = useDashboardKPIs();

  const [prevJobsCount, setPrevJobsCount] = useState<number | undefined>();
  const [prevLeadsCount, setPrevLeadsCount] = useState<number | undefined>();
  const [prevOpenEstimates, setPrevOpenEstimates] = useState<
    number | undefined
  >();
  const [prevArBalance, setPrevArBalance] = useState<number | undefined>();

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes?.user?.id;
      if (!userId) return;

      const { data: uo } = await supabase
        .from("user_orgs")
        .select("org_id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

      const orgId: string | null = (uo?.org_id as string) ?? null;
      if (!orgId) return;

      const windowMs = toUtc.getTime() - fromUtc.getTime();
      const prevFrom = new Date(fromUtc.getTime() - windowMs);
      const prevTo = new Date(fromUtc.getTime());

      try {
        setPrevOpenEstimates(
          await getOpenEstimatesValueInRange(orgId, prevFrom, prevTo)
        );
      } catch (e) {
        console.debug("prev Open Estimates error", e);
      }

      try {
        setPrevJobsCount(await getJobsCountInRange(orgId, prevFrom, prevTo));
      } catch (e) {
        console.debug("prev Jobs error", e);
      }

      try {
        setPrevArBalance(await getARBalanceInRange(orgId, prevFrom, prevTo));
      } catch (e) {
        console.debug("prev AR error", e);
      }

      try {
        setPrevLeadsCount(await getLeadsCountInRange(orgId, prevFrom, prevTo));
      } catch (e) {
        console.debug("prev Leads error", e);
      }
    })();
  }, [fromUtc, toUtc, refreshToken]);

  return (
    <div className="shell">
      {/* Sticky toolbar as a glass card */}
      <div className="sticky-under-nav">
        <div
          className={[
            "glass-panel",     
            "relative",        
            "text-basecolor",  
            "rounded-2xl",     
            "p-3 sm:p-4",           
          ].join(" ")}
        >
          <ViewToolbar
            label="Dashboard"
            right={
              <>
                {/* hide horizontal scrollbar for the actions row */}
                <style>{`.dash-toolbar::-webkit-scrollbar{display:none}`}</style>

                <div
                  className="dash-toolbar flex items-center gap-1 sm:gap-2 min-w-0"
                  style={{ whiteSpace: "nowrap", overflowX: "auto" }}
                >
                  {/* Preset group (single map, accessible radiogroup) */}
                  <div
                    role="radiogroup"
                    aria-label="Date range"
                    className="flex gap-1 sm:gap-1.5 rounded-2xl border border-token bg-surface-2 p-1 sm:p-1.5"
                  >
                    {PRESETS.map((p) => {
                      const checked = preset === p.key;
                      return (
                        <button
                          key={p.key}
                          type="button"
                          role="radio"
                          aria-checked={checked}
                          onClick={() => setPreset(p.key)}
                          className={[
                            "rounded-[9px] leading-none text-basecolor",
                            "px-2 py-1 text-[11px]",
                            "sm:px-2.5 sm:py-1.5 sm:text-xs",
                            "transition-colors active:translate-y-px focus-visible:outline-none focus-visible:ring-token",
                            checked
                              ? "border border-token [background:color-mix(in_srgb,var(--surface-3)_92%,transparent)]"
                              : "border border-transparent bg-transparent hover:[background:color-mix(in_srgb,var(--surface-3)_92%,transparent)]",
                          ].join(" ")}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Refresh */}
                  <button
                    onClick={refresh}
                    title="Manual refresh"
                    className="inline-flex items-center gap-1.5 sm:gap-2 rounded-[9px] leading-none
                    px-2 py-1 text-[11px] sm:px-2.5 sm:py-1.5 sm:text-xs
                    text-basecolor border border-token bg-surface-2
                    hover:[background:color-mix(in_srgb,var(--surface-3)_92%,transparent)]
                    active:translate-y-px focus-visible:outline-none focus-visible:ring-token"
                  >
                    Refresh
                  </button>
                </div>
              </>
            }
          />

          {/* small breathing room below the toolbar card */}
          <div className="h-3" />

          {error && <div className="dashboard-alert">{error}</div>}

          <div className="kpi-grid">
            <DashboardKpiCard
              className="kpi-card tile tile--a"
              tone="a"
              title="Open Estimates"
              value={openEstimatesValue ?? 0}
              previous={prevOpenEstimates}
              format={(v) => `$${v.toLocaleString()}`}
            />

            <DashboardKpiCard
              className="kpi-card tile tile--b"
              tone="b"
              title="Jobs"
              value={jobsTodayCount ?? 0}
              previous={prevJobsCount}
            />

            <DashboardKpiCard
              className="kpi-card tile tile--c"
              tone="c"
              title="Invoices"
              value={arBalance ?? 0}
              previous={prevArBalance}
              format={(v) => `$${v.toLocaleString()}`}
            />

            <DashboardKpiCard
              className="kpi-card tile tile--d"
              tone="d"
              title="Leads"
              value={leadsThisWeekCount ?? 0}
              previous={prevLeadsCount}
            />
          </div>

          </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <>
      <PageHeader />
      <DashboardFiltersProvider>
        <DashboardInner />
      </DashboardFiltersProvider>
    </>
  );
}