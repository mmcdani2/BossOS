import { useEffect, useState } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { getOpenEstimatesValueInRange } from "../../lib/api/estimates"; // ⬅️ changed
import { getJobsCountInRange } from "../../lib/api/jobs";
import { getARBalanceInRange } from "../../lib/api/invoices";
import { getLeadsCountInRange } from "../../lib/api/leads";
import { useDashboardFilters } from "@/features/dashboard/state/dashboardFilters"; // ⬅️ new

type KPIState = {
  openEstimatesValue: number | null;
  jobsTodayCount: number | null;
  arBalance: number | null;
  leadsThisWeekCount: number | null;
};

export function useDashboardKPIs() {
  const { orgId } = useAuth();
  const { fromUtc, toUtc, refreshToken } = useDashboardFilters(); // ⬅️ new
  const [data, setData] = useState<KPIState>({
    openEstimatesValue: null,
    jobsTodayCount: null,
    arBalance: null,
    leadsThisWeekCount: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      // Open Estimates, respects date range
      getOpenEstimatesValueInRange(orgId, fromUtc, toUtc),
      getJobsCountInRange(orgId, fromUtc, toUtc),    
      getARBalanceInRange(orgId, fromUtc, toUtc), 
      getLeadsCountInRange(orgId, fromUtc, toUtc),  
    ])
      .then(([openEstimatesValue, jobsTodayCount, arBalance, leadsThisWeekCount]) => {
        if (cancelled) return;
        setData({ openEstimatesValue, jobsTodayCount, arBalance, leadsThisWeekCount });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    //re-run when range or manual refresh changes
  }, [orgId, fromUtc, toUtc, refreshToken]);

  return { ...data, loading, error };
}
