import { useState } from "react";
import Logo from "@/ui/Logo";
import { supabase } from "@/lib/supabase/client";

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
        options: { emailRedirectTo: `${window.location.origin}/` },
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
    <div className="auth-center">
      <div className="auth-card">
        <Logo />
        {sent ? (
          <div className="auth-stack">
            <h1 className="auth-heading">Check your email</h1>
            <p className="auth-helper">
              We sent a link to <b>{email}</b>. You can close this tab after
              signing in.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="auth-stack">
            <h1 className="auth-heading">Run your business like a boss!</h1>
            <p className="auth-subheading">Sign in to access your dashboard</p>
            {err ? <div className="auth-error">Error: {err}</div> : null}
            <input
              className="auth-input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="auth-btn" type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send Verification Link"}
            </button>
            <p className="auth-helper">
              Don’t have an account?{" "}
              <a href="/register" style={{ textDecoration: "underline" }}>
                Register now
              </a>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
