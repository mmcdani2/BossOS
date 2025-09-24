import { supabase } from "@/lib/supabase/client";

export async function addMembership(
  userId: string,
  orgId: string,
  role: "owner" | "admin" | "member" = "owner"
) {
  return supabase.from("memberships").insert({ user_id: userId, org_id: orgId, role });
}
