// src/features/auth/AuthCallback.tsx
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallback() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 1) Exchange magic-link / OAuth code for a session (supports both SDK signatures)
      const code =
        new URLSearchParams(window.location.search).get("code") ?? undefined;
      try {
        // newer SDKs (no args)
        // @ts-expect-error: some versions accept no arg
        await supabase.auth.exchangeCodeForSession();
      } catch {
        if (code) {
          // older SDKs (expects { authCode })
          // @ts-expect-error: legacy signature
          await supabase.auth.exchangeCodeForSession({ authCode: code });
        }
      }

      // 2) Wait briefly for session to materialize
      for (let i = 0; i < 20; i++) {
        if (cancelled) return;
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user?.id) break;
        await new Promise((r) => setTimeout(r, 80));
      }
      if (cancelled) return;

      // 3) Decide destination by onboarding flag
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes?.user ?? null;
      if (!user) {
        if (!cancelled) window.location.replace("/signin");
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      const done = prof?.onboarding_complete === true;
      window.location.replace(done ? "/" : "/onboarding");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="auth-center">
      <div className="auth-card glass-surface">Finishing sign-in…</div>
    </div>
  );
}
