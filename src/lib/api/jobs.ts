import { supabase } from "@/lib/supabase/client";

export async function getJobsCountInRange(
  orgId: string,
  fromUtc: Date,
  toUtc: Date,
  statuses: string[] = ["scheduled"]
): Promise<number> {
  let q = supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId)
    .gte("scheduled_at", fromUtc.toISOString())
    .lt("scheduled_at", toUtc.toISOString());
  if (statuses.length) q = q.in("status", statuses);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}
