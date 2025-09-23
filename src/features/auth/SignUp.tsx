// src/features/auth/SignUp.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import Logo from "@/ui/Logo";
import { Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  agree: z.boolean().refine((v) => v === true, {
    message: "Please accept the Terms to continue",
  }),
});
type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", agree: false },
  });

  async function onSubmit({ email }: FormData) {
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      {/* same subtle grid + blur as SignIn */}
      <div className="absolute inset-0 auth-grid-overlay backdrop-blur-[2px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="relative w-full max-w-md">
        <div
          className="
            relative w-full max-w-md
            bg-slate-800/50 backdrop-blur-xl rounded-2xl
            border border-slate-700/50 shadow-2xl shadow-slate-900/50
            p-6 sm:p-8
          "
        >
          <div className="text-center mb-6 sm:mb-8">
            <Logo />
            <h1
              className="
                text-2xl font-extrabold tracking-tight
                bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent
              "
            >
              Create your account
            </h1>
            {!sent && (
              <p className="mt-1 text-sm text-slate-300/80">
                We’ll send a sign-in link to your email
              </p>
            )}
          </div>

          {sent ? (
            <div className="space-y-3 text-center">
              <h2 className="text-lg font-semibold text-white">
                Check your email
              </h2>
              <p className="text-sm text-slate-300/80">
                We’ve sent a magic link to complete your sign up.
              </p>
              <p className="auth-switch" style={{ textAlign: "center" }}>
                Already have an account?{" "}
                <Link className="auth-link" to="/signin">
                  Back to sign in
                </Link>
              </p>
            </div>
          ) : (
            <form
              className="space-y-4 sm:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              {err && (
                <div className="text-sm text-rose-300 bg-rose-500/10 border border-rose-400/30 rounded-md px-3 py-2">
                  Error: {err}
                </div>
              )}

              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  disabled={busy}
                  {...register("email")}
                  className="
                    w-full rounded-xl px-4 py-3
                    bg-slate-800/30 text-white placeholder-slate-400
                    border border-slate-700/50
                    outline-none transition-all duration-300
                    focus:ring-2 focus:ring-orange-500/50 focus:border-transparent
                    text-center tracking-wide
                  "
                />
                {errors.email && (
                  <p className="auth-error mt-2">{errors.email.message}</p>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    disabled={busy}
                    {...register("agree")}
                  />
                  <span>
                    I agree to the{" "}
                    <Link className="auth-link" to="/terms">
                      Terms
                    </Link>{" "}
                    &{" "}
                    <Link className="auth-link" to="/privacy">
                      Privacy
                    </Link>
                  </span>
                </label>
              </div>
              {errors.agree && (
                <p className="auth-error">{errors.agree.message}</p>
              )}

              <button
                className="
                  w-full rounded-xl py-3 font-semibold text-white
                  bg-gradient-to-r from-orange-500 to-red-500
                  hover:shadow-lg hover:shadow-orange-500/25
                  focus:outline-none focus:ring-2 focus:ring-orange-500/50
                  transition-all duration-300 transform hover:-translate-y-0.5
                  disabled:opacity-70 disabled:cursor-not-allowed
                "
                disabled={busy}
              >
                {busy ? "Sending…" : "Send Verification Link"}
              </button>

              <p className="auth-switch" style={{ textAlign: "center" }}>
                Already have an account?{" "}
                <Link className="auth-link" to="/signin">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
