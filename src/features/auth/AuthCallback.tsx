// src/features/auth/AuthCallback.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Finishing sign-in…");

  useEffect(() => {
    (async () => {
      try {
        // Supabase email links include a ?code=... (or in hash)
        const hasCode =
          window.location.search.includes("code=") ||
          window.location.hash.includes("access_token") ||
          window.location.hash.includes("type=");

        if (hasCode) {
          const { error } = await supabase.auth.exchangeCodeForSession(
            // Works with both search or hash variants
            window.location.href
          );
          if (error) throw error;
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // decide where to go next (onboarding vs dashboard)
          navigate("/onboarding/profile", { replace: true });
        } else {
          // no session — back to sign-in
          navigate("/signin", { replace: true });
        }
      } catch (e) {
        const m = e instanceof Error ? e.message : "Auth failed";
        setMsg(`Error: ${m}`);
        // fall back after a moment
        setTimeout(() => navigate("/signin", { replace: true }), 1500);
      }
    })();
  }, [navigate]);

  return (
    <div className="auth-center">
      <div className="auth-card glass-surface">{msg}</div>
    </div>
  );
}
