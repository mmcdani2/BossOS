// src/features/auth/AuthCallback.tsx
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Ensure session is established after redirect
        const { error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        // Must have a signed-in user here
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/signin", { replace: true });
          return;
        }

        // Check if onboarding is complete
        const { data: prof, error: profErr } = await supabase
          .from("profiles")
          .select("onboarding_complete")
          .eq("id", user.id)
          .maybeSingle();

        if (profErr) {
          // If we can't read profile for any reason, send to onboarding as a safe default
          console.warn("Profile lookup error:", profErr.message);
        }

        const needsOnboarding = !(prof && prof.onboarding_complete === true);
        navigate(needsOnboarding ? "/onboarding" : "/dashboard", { replace: true });
      } catch (e) {
        console.error("Auth callback error:", e);
        navigate("/signin", { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="auth-center">
      <div className="auth-card glass-surface">Finishing sign-in…</div>
    </div>
  );
}
