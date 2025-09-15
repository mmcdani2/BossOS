import { supabase } from "../supabase/client";

export async function getOpenEstimatesValue(orgId: string): Promise<number> {
  const { data, error } = await supabase
    .from("estimates")
    .select("total")
    .in("status", ["draft", "sent"])
    .eq("org_id", orgId);

  if (error) {
    console.error("getOpenEstimatesValue error:", error);
    return 0;
  }

  // ensure numeric return, handle nulls safely
  return (
    data?.reduce(
      (sum, row: { total: number | null }) => sum + (row.total ?? 0),
      0
    ) ?? 0
  );
}
