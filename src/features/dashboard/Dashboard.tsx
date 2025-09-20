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
      {/* Sticky toolbar as a card (replaces <DashboardToolbar />) */}
      <div className="sticky-under-nav">
        <GlassCard className="p-3">
          <ViewToolbar
            label="Dashboard"
            right={
              <>
                {/* hide scrollbar like before */}
                <style>{`.dash-toolbar > div::-webkit-scrollbar{display:none}`}</style>

                {/* actions row */}
                <div className="flex items-center gap-2">
                  {/* grouped presets — replaces .dt-segment */}
                  <div className="flex gap-1.5 rounded-2xl border border-white/20 bg-white/5 p-1.5">
                    {PRESETS.map((p) => (
                      <button
                        key={p.key}
                        onClick={() => setPreset(p.key)}
                        className={[
                          "px-2.5 py-1.5 text-xs leading-none rounded-[9px] text-slate-300",
                          "hover:bg-white/5 hover:text-slate-200 active:translate-y-px",
                          // keep gradient via small CSS class
                          preset === p.key
                            ? "dt-btn--active"
                            : "border border-transparent bg-transparent",
                        ].join(" ")}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* refresh — replaces .dt-refresh */}
                  <button
                    onClick={refresh}
                    title="Manual refresh"
                    className="px-2.5 py-1.5 text-xs leading-none rounded-[9px] text-slate-200
                     border border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30
                     active:translate-y-px"
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
