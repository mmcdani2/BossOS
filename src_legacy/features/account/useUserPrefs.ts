import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
type UserPrefs = {
  timezone?: string | null;
  date_format?: string | null;
  first_day_of_week?: number | null; // 0 or 1
  theme?: "system" | "dark" | "light" | null;
  notifications?: { email?: boolean; push?: boolean; jobs?: boolean; invoices?: boolean } | null;
};

export function useUserPrefs() {
  const [prefs, setPrefs] = useState<UserPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;
      if (!userId) { setLoading(false); return; }
      const { data, error } = await supabase
        .from("user_prefs")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) setError(error.message);
      setPrefs(data ?? {});
      setLoading(false);
    })();
  }, []);

  const save = async (patch: Partial<UserPrefs>) => {
    setSaving(true);
    setError(null);
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes.user?.id;
    if (!userId) { setSaving(false); return; }
    const next = { ...(prefs ?? {}), ...patch };
    const { error } = await supabase
      .from("user_prefs")
      .upsert({ user_id: userId, ...next, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    if (error) setError(error.message); else setPrefs(next);
    setSaving(false);
  };

  return { prefs, setPrefs, save, loading, saving, error };
}

