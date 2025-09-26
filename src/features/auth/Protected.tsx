// src/features/auth/Protected.tsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Protected({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading"|"unauth"|"incomplete"|"complete">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setStatus("unauth");
        return;
      }
      const { data: prof } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", user.id)
        .maybeSingle();
      if (!cancelled) {
        if (prof?.onboarding_complete) setStatus("complete");
        else setStatus("incomplete");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (status === "loading") return null;
  if (status === "unauth") return <Navigate to="/signin" replace />;
  if (status === "incomplete") return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}
