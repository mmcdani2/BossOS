import { supabase } from "../supabase/client";

export async function getJobsTodayCount(orgId: string): Promise<number> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("org_id", orgId)
    .gte("scheduled_at", `${today}T00:00:00Z`)
    .lte("scheduled_at", `${today}T23:59:59Z`);

  if (error) {
    console.error("getJobsTodayCount error:", error);
    return 0;
  }
  return count ?? 0;
}
