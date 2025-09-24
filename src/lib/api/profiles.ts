// lib/api/profiles.ts
import { supabase } from "@/lib/supabase/client";

export async function upsertProfile(
  id: string,
  patch: { full_name?: string; phone?: string; onboarding_complete?: boolean }
) {
  return supabase
    .from("profiles")
    .upsert({ id, ...patch, updated_at: new Date().toISOString() }, { onConflict: "id" })
    .select()
    .single();
}
