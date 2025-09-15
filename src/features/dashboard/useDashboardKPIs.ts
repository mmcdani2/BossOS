import { useEffect, useState } from "react";
import { useAuth } from "../../app/providers/AuthProvider";
import { getOpenEstimatesValue } from "../../lib/api/estimates";
import { getJobsTodayCount } from "../../lib/api/jobs";
import { getARBalance } from "../../lib/api/invoices";
import { getLeadsThisWeekCount } from "../../lib/api/leads";

type KPIState = {
  openEstimatesValue: number | null;
  jobsTodayCount: number | null;
  arBalance: number | null;
  leadsThisWeekCount: number | null;
};

export function useDashboardKPIs() {
  const { orgId } = useAuth();
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
      getOpenEstimatesValue(orgId),
      getJobsTodayCount(orgId),
      getARBalance(orgId),
      getLeadsThisWeekCount(orgId),
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
  }, [orgId]);

  return { ...data, loading, error };
}
