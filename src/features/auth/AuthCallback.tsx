// src/features/auth/AuthCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthTransition from "./AuthTransition";
import { supabase } from "@/lib/supabase/client";

type Phase = "verifying" | "fetching" | "routing" | "error";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("verifying");
  const [show, setShow] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // ---- 1) Exchange magic-link / OAuth code (keeps your dual-signature fallback) ----
        const code = new URLSearchParams(window.location.search).get("code") ?? undefined;
        setPhase("verifying");
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

        // ---- 2) Wait briefly for session to materialize (your loop preserved) ----
        for (let i = 0; i < 20; i++) {
          if (cancelled) return;
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user?.id) break;
          await new Promise((r) => setTimeout(r, 80));
        }
        if (cancelled) return;

        // ---- 3) Decide destination by onboarding flag (unchanged logic) ----
        setPhase("fetching");
        const { data: userRes } = await supabase.auth.getUser();
        const user = userRes?.user ?? null;
        if (!user) {
          if (!cancelled) {
            setPhase("error");
            setShow(false);
            navigate("/signin?error=callback", { replace: true });
          }
          return;
        }

        const { data: prof } = await supabase
          .from("profiles")
          .select("onboarding_complete")
          .eq("id", user.id)
          .maybeSingle();

        if (cancelled) return;

        setPhase("routing");
        const dest = prof?.onboarding_complete === true ? "/" : "/onboarding";

        // brief fade-out, then route (keeps your redirect intent, but with nicer transition)
        setTimeout(() => {
          if (cancelled) return;
          setShow(false);
          setTimeout(() => !cancelled && navigate(dest, { replace: true }), 160);
        }, 120);
      } catch {
        if (!cancelled) setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // Branded overlay (no card)
  return (
    <AuthTransition
      phase={phase}
      show={show}
      subMessage={
        phase === "verifying"
          ? "Verifying your magic link"
          : phase === "fetching"
          ? "Loading your profile"
          : phase === "routing"
          ? "Finishing up"
          : undefined
      }
    />
  );
}
