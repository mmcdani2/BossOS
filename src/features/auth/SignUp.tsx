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
          shouldCreateUser: true, // create if missing (passwordless)
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        // friendlier messaging for common cases
        const msg = /already registered/i.test(error.message)
          ? "This email is already registered. Try signing in instead."
          : error.message;
        throw new Error(msg);
      }
      setSent(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-center app-bg app-ambient">
      <div className="auth-card glass-surface">
        <div className="text-center mb-6 sm:mb-8">
          <Logo />
          <h1 className="auth-title">Create your account</h1>
          {!sent && (
            <p className="auth-subtext">
              We’ll send a verification link to your email.
            </p>
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
            <p className="auth-subtext">
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
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {err && <div className="auth-banner-error">Error: {err}</div>}

            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                disabled={busy}
                {...register("email")}
                className="auth-input auth-input--center"
                autoComplete="email"
                inputMode="email"
                required
              />
              {errors.email && (
                <p className="auth-error mt-2">{errors.email.message}</p>
              )}
            </div>

            <div style={{ textAlign: "center" }}>
              <label className="auth-checkbox">
                <input type="checkbox" disabled={busy} {...register("agree")} />
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

            <button className="auth-btn-primary" disabled={busy}>
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
  );
}
