import { supabase } from "@/lib/supabase/client";

export async function upsertProfile(
  userId: string,
  patch: { full_name?: string; onboarding_complete?: boolean }
) {
  return supabase.from("profiles").upsert({ id: userId, ...patch });
}
