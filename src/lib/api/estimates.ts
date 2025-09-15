// src/lib/api/estimates.ts
import { supabase } from "@/lib/supabase/client";

/** The statuses that count as "open" for estimates. */
export const OPEN_ESTIMATE_STATUSES = ["sent", "draft"] as const;
export type OpenEstimateStatus = (typeof OPEN_ESTIMATE_STATUSES)[number];

type EstimateRow = {
  total: string | number | null; // Supabase often returns numerics as strings
  status: OpenEstimateStatus | "accepted" | "declined";
  created_at: string; // ISO-8601
};

function toNumber(x: string | number | null | undefined): number {
  if (x == null) return 0;
  return typeof x === "number" ? x : Number(x);
}

/**
 * Sum of "open" estimates (sent + draft) created within [fromUtc, toUtc).
 * Uses a half-open window so days align with [startOfDay, startOfNextDay).
 */
export async function getOpenEstimatesValueInRange(
  orgId: string,
  fromUtc: Date,
  toUtc: Date,
  // NOTE: mark as readonly so default (readonly tuple) is assignable
  statuses: readonly OpenEstimateStatus[] = OPEN_ESTIMATE_STATUSES
): Promise<number> {
  // Supabase .in expects string[], so spread to a mutable array and widen
  const statusArray = [...statuses] as string[];

  const { data, error } = await supabase
    .from("estimates")
    .select("total, status, created_at")
    .eq("org_id", orgId)
    .in("status", statusArray)
    .gte("created_at", fromUtc.toISOString())
    .lt("created_at", toUtc.toISOString());

  if (error) throw error;

  const rows = (data ?? []) as EstimateRow[];
  return rows.reduce((sum, row) => sum + toNumber(row.total), 0);
}
