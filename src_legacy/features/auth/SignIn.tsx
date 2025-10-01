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
    if (!email) {
      setErr("Please enter your email.");
      return;
    }

    setBusy(true);
    setErr(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // don’t auto-create new users
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes("Signups not allowed for otp")) {
          throw new Error(
            "No account found with that email. Please sign up first."
          );
        }
        throw error;
      }
      setSent(true);
    } catch (e: unknown) {
      if (e instanceof Error) setErr(e.message);
      else setErr("We couldn’t sign you in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-center app-bg app-ambient">
      <div className="card card--compact-xs glass-panel">
        <div className="text-center mb-6 sm:mb-8">
          <Logo />
          <h1 className="title">Run your business like a boss!</h1>
          {!sent && (
            <p className="subtext">Sign in to access your dashboard</p>
          )}
        </div>

        {sent ? (
          <div className="space-y-3 text-center">
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text)" }}
            >
              Check your email
            </h2>
            <p className="subtext">
              We sent a link to <b style={{ color: "var(--text)" }}>{email}</b>.
              You can close this tab after signing in.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="form">
            {err && <div className="form-banner--error">Error: {err}</div>}

            <div className="relative">
              <input
                className="form-input form-input--center"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? "Sending…" : "Send Verification Link"}
            </button>

              <p className="text-muted text-center mt-[10px]">
              Don’t have an account?{" "}
              <Link to="/register" className="link">
                Register now
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
