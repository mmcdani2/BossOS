// src/features/auth/AuthCallback.tsx
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // Finalize the session (Supabase attaches via hash)
      await supabase.auth.getSession();

      // Look up current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/signin", { replace: true });
        return;
      }

      // Check profile onboarding flag
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.onboarding_complete) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="auth-center">
      <div className="auth-card glass-surface">Finishing sign-in…</div>
    </div>
  );
}
