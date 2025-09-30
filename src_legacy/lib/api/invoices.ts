import { supabase } from "@/lib/supabase/client";

type InvoiceRow = { total: number | string | null; status: string; issue_date: string };

export async function getARBalanceInRange(
  orgId: string,
  fromUtc: Date,
  toUtc: Date,
  statuses: string[] = ["open", "overdue"]
): Promise<number> {
  const fromDate = fromUtc.toISOString().slice(0, 10);
  const toDate   = toUtc.toISOString().slice(0, 10);

  let q = supabase
    .from("invoices")
    .select("total, status, issue_date")
    .eq("org_id", orgId)
    .gte("issue_date", fromDate)
    .lt("issue_date", toDate);
  if (statuses.length) q = q.in("status", statuses);

  const { data, error } = await q;
  if (error) throw error;
  const rows = (data ?? []) as InvoiceRow[];
  return rows.reduce((sum, r) => sum + Number(r.total ?? 0), 0);
}
