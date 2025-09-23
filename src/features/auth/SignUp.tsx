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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="auth-center">
        <div className="auth-card glass-surface">
          <Logo />
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-subtext">
            We’ve sent a magic link to complete your sign up.
          </p>
          <a className="auth-link" href="/signin">
            Back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-center">
      <div className="auth-card glass-surface">
        <Logo />
        <h1 className="auth-title">Create your account</h1>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="auth-label" htmlFor="email">
            Work email
          </label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder="you@company.com"
            {...register("email")}
            disabled={busy}
          />
          {errors.email && <p className="auth-error">{errors.email.message}</p>}

          <label className="auth-checkbox">
            <input type="checkbox" {...register("agree")} disabled={busy} />
            <span>
              I agree to the{" "}
              <a className="auth-link" href="/terms">
                Terms
              </a>{" "}
              &{" "}
              <a className="auth-link" href="/privacy">
                Privacy
              </a>
            </span>
          </label>
          {errors.agree && <p className="auth-error">{errors.agree.message}</p>}

          {err && <div className="auth-banner-error">{err}</div>}

          <button className="auth-button" disabled={busy}>
            {busy ? "Sending..." : "Send magic link"}
          </button>
        </form>

        <p className="auth-switch" style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link className="auth-link" to="/signin">Back to sign in</Link>

        </p>
      </div>
    </div>
  );
}
