import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { upsertProfile } from "@/lib/api/profiles";
import { supabase } from "@/lib/supabase/client";

export default function StepProfile() {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onNext(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);

    const {
      data: { user },
      error: uerr,
    } = await supabase.auth.getUser();
    if (uerr || !user) {
      setErr("You must be signed in.");
      setBusy(false);
      return;
    }

    const full_name = name.trim() || null;
    const { error } = await upsertProfile(user.id, { full_name });
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }

    navigate("/onboarding/company");
  }

  return (
    <form onSubmit={onNext} className="auth-form">
      {err && (
        <div className="auth-banner-error" role="alert" aria-live="polite">
          Error: {err}
        </div>
      )}

      <div className="relative">
        <input
          className="auth-input auth-input--center"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="auth-wizard-actions">
        <button className="auth-btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Continue"}
        </button>
      </div>

      <div className="auth-wizard-links justify-center mt-3">
        <Link to="/onboarding/company" className="auth-link">
          Skip
        </Link>
      </div>
    </form>
  );
}
