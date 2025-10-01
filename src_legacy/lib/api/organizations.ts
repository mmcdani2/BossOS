import { supabase } from "@/lib/supabase/client";

export async function createOrganization(input: { name: string; timezone: string }) {
  return supabase.from("organizations").insert(input).select("id").single();
}

export async function updateOrganization(orgId: string, patch: Record<string, unknown>) {
  return supabase.from("organizations").update(patch).eq("id", orgId);
}
