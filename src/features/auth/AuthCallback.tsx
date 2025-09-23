// src/features/auth/AuthCallback.tsx
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    // Supabase attaches session via URL hash; get it then route onward.
    supabase.auth.getSession().then(() => {
      navigate("/dashboard"); // or /onboarding
    });
  }, [navigate]);
  return <div className="auth-center"><div className="auth-card glass-surface">Finishing sign-in…</div></div>;
}
