import { supabase } from "../supabase/client";

/**
 * Assumes:
 * - Table: leads
 * - Columns: org_id (uuid/text), created_at (timestamp)
 * - "This week" = from Monday 00:00 to now, based on system timezone
 */
export async function getLeadsThisWeekCount(orgId: string): Promise<number> {
  const now = new Date();
  const day = now.getDay(); // 0=Sunday
  const diff = (day === 0 ? -6 : 1 - day); // shift back to Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("leads")
    .select("id", { count: "exact" })
    .eq("org_id", orgId)
    .gte("created_at", monday.toISOString());

  if (error) {
    console.error("getLeadsThisWeekCount error:", error);
    return 0;
  }

  return data ? data.length : 0;
}
