// src/features/auth/AuthCallback.tsx
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 1) Try to exchange the magic-link/OAuth code for a session (covers both SDK signatures)
      const code = new URLSearchParams(window.location.search).get("code") ?? undefined;
      try {
        // @ts-expect-error (newer supabase-js accepts no args)
        await supabase.auth.exchangeCodeForSession();
      } catch {
        if (code) {
          // @ts-expect-error (older supabase-js expects { authCode })
          await supabase.auth.exchangeCodeForSession({ authCode: code });
        }
      }

      // 2) Wait until the session is actually present (so the guard won't bounce us)
      for (let i = 0; i < 20; i++) { // try for ~2s
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user?.id) break;
        await new Promise(r => setTimeout(r, 100));
      }
      if (cancelled) return;

      // 3) Hard redirect to avoid any SPA ping-pong
      window.location.replace("/onboarding");
    })();

    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="auth-center">
      <div className="auth-card glass-surface">Finishing sign-in…</div>
    </div>
  );
}
