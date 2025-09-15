import { supabase } from "@/lib/supabase/client";

/**
 * Count leads created within [fromUtc, toUtc).
 * By default includes all statuses: new, contacted, qualified, lost.
 */
export async function getLeadsCountInRange(
  orgId: string,
  fromUtc: Date,
  toUtc: Date,
  statuses: string[] = ["new", "contacted", "qualified", "lost"]
): Promise<number> {
  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId)
    .in("status", statuses)
    .gte("created_at", fromUtc.toISOString())
    .lt("created_at", toUtc.toISOString());

  if (error) throw error;
  return count ?? 0;
}
