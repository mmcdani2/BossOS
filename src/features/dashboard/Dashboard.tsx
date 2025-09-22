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

  const fmtMoney = (v: number | null) =>
    v !== null ? `$${v.toLocaleString()}` : "—";
  const fmtCount = (v: number | null) => (v !== null ? v : "—");

  const [prevJobsCount, setPrevJobsCount] = useState<number | undefined>();
  const [prevLeadsCount, setPrevLeadsCount] = useState<number | undefined>();
  const [prevOpenEstimates, setPrevOpenEstimates] = useState<number | undefined>();
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

  const renderTrend = (
    current: number | null,
    previous: number | undefined,
    kind: "money" | "count"
  ) => {
    if (current == null || previous === undefined) return null;
    const diff = current - previous;
    const up = diff > 0;
    const down = diff < 0;
    const klass = up
      ? "kpi-trend kpi-trend--up"
      : down
      ? "kpi-trend kpi-trend--down"
      : "kpi-trend kpi-trend--flat";
    const fmt =
      kind === "money"
        ? (n: number) => `$${Math.abs(n).toLocaleString()}`
        : (n: number) => Math.abs(n).toLocaleString();
    return (
      <div className={klass}>
        <span className="icon" aria-hidden>
          {up ? "▲" : down ? "▼" : "◆"}
        </span>
        <span>{diff === 0 ? "No change" : fmt(diff)}</span>
      </div>
    );
  };

  return (
    <div className="shell">
      {/* Sticky toolbar as a glass card */}
      <div className="sticky-under-nav">
        <GlassCard className="p-3">
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
                  {/* Preset group */}
                  <div className="flex gap-1 sm:gap-1.5 rounded-2xl border border-token bg-surface-2 p-1 sm:p-1.5">
                    {PRESETS.map((p) => {
                      const isActive = preset === p.key;
                      return (
                        <button
                          key={p.key}
                          onClick={() => setPreset(p.key)}
                          aria-pressed={isActive}
                          className={[
                            "rounded-[9px] leading-none text-basecolor",
                            "px-2 py-1 text-[11px]",
                            "sm:px-2.5 sm:py-1.5 sm:text-xs",
                            "transition-colors active:translate-y-px focus-visible:outline-none focus-visible:ring-token",
                            isActive
                              ? // active token style (subtle fill + border)
                                "border border-token [background:color-mix(in_srgb,var(--surface-3)_92%,transparent)]"
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
        </GlassCard>
      </div>

      {/* small breathing room below the toolbar card */}
      <div className="h-3" />

      {error && <div className="dashboard-alert">{error}</div>}

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value">{fmtMoney(openEstimatesValue)}</div>
          <div className="kpi-label">Open Estimates</div>
          {renderTrend(openEstimatesValue ?? 0, prevOpenEstimates, "money")}
        </div>

        <div className="kpi-card">
          <div className="kpi-value">{fmtCount(jobsTodayCount)}</div>
          <div className="kpi-label">Jobs</div>
          {renderTrend(jobsTodayCount ?? 0, prevJobsCount, "count")}
        </div>

        <div className="kpi-card">
          <div className="kpi-value">{fmtMoney(arBalance)}</div>
          <div className="kpi-label">Invoices</div>
          {renderTrend(arBalance ?? 0, prevArBalance, "money")}
        </div>

        <div className="kpi-card">
          <div className="kpi-value">{fmtCount(leadsThisWeekCount)}</div>
          <div className="kpi-label">Leads</div>
          {renderTrend(leadsThisWeekCount ?? 0, prevLeadsCount, "count")}
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
