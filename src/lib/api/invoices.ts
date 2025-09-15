import { supabase } from "../supabase/client";

export async function getARBalance(orgId: string): Promise<number> {
  const { data, error } = await supabase
    .from("invoices")
    .select("total, status")
    .eq("org_id", orgId)
    .in("status", ["open", "overdue", "partial"]);

  if (error) {
    console.error("getARBalance error:", error);
    return 0;
  }

  return (
    data?.reduce(
      (sum, row: { total: number | null }) => sum + (row.total ?? 0),
      0
    ) ?? 0
  );
}
