import { useState } from "react";
import Logo from "@/ui/Logo";
import { supabase } from "@/lib/supabase/client";
import { FiMail } from "react-icons/fi";

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
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      {/* Subtle grid + blur like the snippet */}
      <div className="absolute inset-0 auth-grid-overlay backdrop-blur-[2px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative w-full max-w-md">
      {/* Ambient blobs */}
      {/*<div className="pointer-events-none absolute -bottom-48 -left-48 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -top-48 -right-48 w-96 h-96 bg-red-500/15 rounded-full blur-3xl" />

      {/* Card */}
      <div className="
        relative w-full max-w-md
        bg-slate-800/50 backdrop-blur-xl rounded-2xl
        border border-slate-700/50 shadow-2xl shadow-slate-900/50
        p-6 sm:p-8
      ">
        <div className="text-center mb-6 sm:mb-8">
          {/* Brand tile */}

          {/* keep your Logo if you prefer it over text */}
          <Logo />

          <h1 className="
            text-2xl font-extrabold tracking-tight
            bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent
          ">
            Run your business like a boss!
          </h1>
          {!sent && (
            <p className="mt-1 text-sm text-slate-300/80">
              Sign in to access your dashboard
            </p>
          )}
        </div>

        {/* Body */}
        {sent ? (
          <div className="space-y-3 text-center">
            <h2 className="text-lg font-semibold text-white">Check your email</h2>
            <p className="text-sm text-slate-300/80">
              We sent a link to <b className="text-white">{email}</b>. You can close this tab after signing in.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 sm:space-y-6">
            {err && (
              <div className="text-sm text-rose-300 bg-rose-500/10 border border-rose-400/30 rounded-md px-3 py-2">
                Error: {err}
              </div>
            )}

            {/* Email input */}
            <div className="relative">
              <input
                className="
      w-full rounded-xl px-4 py-3
      bg-slate-800/30 text-white placeholder-slate-400
      border border-slate-700/50
      outline-none transition-all duration-300
      focus:ring-2 focus:ring-orange-500/50 focus:border-transparent
      text-center tracking-wide
    "
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Orange gradient CTA */}
            <button
              type="submit"
              disabled={busy}
              className="
                w-full rounded-xl py-3 font-semibold text-white
                bg-gradient-to-r from-orange-500 to-red-500
                hover:shadow-lg hover:shadow-orange-500/25
                focus:outline-none focus:ring-2 focus:ring-orange-500/50
                transition-all duration-300 transform hover:-translate-y-0.5
                disabled:opacity-70 disabled:cursor-not-allowed
              "
            >
              {busy ? "Sending…" : "Send Verification Link"}
            </button>

            <p className="text-center text-sm text-slate-400">
              Don’t have an account?{" "}
              <a href="/register" className="underline underline-offset-2 decoration-orange-400 hover:text-orange-300">
                Register now
              </a>
              .
            </p>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}
