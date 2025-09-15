import Nav from "@/ui/Nav";
import { useDashboardKPIs } from "./useDashboardKPIs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { DashboardFiltersProvider } from "@/features/dashboard/state/dashboardFilters";
import DashboardToolbar from "@/features/dashboard/components/DashboardToolbar";
import { useDashboardFilters } from "@/features/dashboard/state/dashboardFilters";
import { getOpenEstimatesValueInRange } from "@/lib/api/estimates";
import { getJobsCountInRange } from "@/lib/api/jobs";
import { getARBalanceInRange } from "@/lib/api/invoices";
import { getLeadsCountInRange } from "@/lib/api/leads";

function DashboardInner() {
  const { preset, fromUtc, toUtc, refreshToken } = useDashboardFilters();

  const rangeLabel =
    preset === "today"
      ? "Today"
      : preset === "7d"
      ? "Last 7 Days"
      : preset === "30d"
      ? "Last 30 Days"
      : "Last 90 Days";

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
      <DashboardToolbar />
      <div className="dashboard-subtitle">Showing data for: {rangeLabel}</div>
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
      <Nav />
      <DashboardFiltersProvider>
        <DashboardInner />
      </DashboardFiltersProvider>
    </>
  );
}
