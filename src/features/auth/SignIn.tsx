import { useState } from "react";
import Logo from "@/ui/Logo";
import { supabase } from "@/lib/supabase/client";
import { Link } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      setSent(true);
    } catch (e: unknown) {
      if (e instanceof Error) setErr(e.message);
      else setErr("Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  
return (
  <div className="auth-center auth-bg">
    <div className="auth-card glass-surface">
      <div className="text-center mb-6 sm:mb-8">
        <Logo />
        <h1 className="auth-title">Run your business like a boss!</h1>
        {!sent && (
          <p className="auth-subtext">Sign in to access your dashboard</p>
        )}
      </div>

      {sent ? (
        <div className="space-y-3 text-center">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
            Check your email
          </h2>
          <p className="auth-subtext">
            We sent a link to <b style={{ color: "var(--text)" }}>{email}</b>. You can
            close this tab after signing in.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="auth-form">
          {err && <div className="auth-banner-error">Error: {err}</div>}

          <div className="relative">
            <input
              className="auth-input auth-input--center"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={busy} className="auth-btn-primary">
            {busy ? "Sending…" : "Send Verification Link"}
          </button>

          <p className="auth-switch" style={{ textAlign: "center" }}>
            Don’t have an account?{" "}
            <Link to="/register" className="auth-link">
              Register now
            </Link>
          </p>
        </form>
      )}
    </div>
  </div>
);

}
