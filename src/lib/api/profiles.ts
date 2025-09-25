import { supabase } from "@/lib/supabase/client";

export type ProfileUpdate = {
  full_name?: string | null;
  onboarding_complete?: boolean;
};

export async function upsertProfile(userId: string, patch: ProfileUpdate) {
  const payload = { id: userId, ...patch };
  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
  return { data, error };
}

export async function getMyProfile() {
  const { data: { user }, error: uerr } = await supabase.auth.getUser();
  if (uerr || !user) return { data: null, error: uerr ?? new Error("No user") };
  return await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
}
