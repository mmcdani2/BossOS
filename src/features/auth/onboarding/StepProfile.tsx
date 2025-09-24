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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErr("You must be signed in.");
      setBusy(false);
      return;
    }

    // Save profile name
    const { error } = await upsertProfile(user.id, { full_name: name });
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }

    navigate("/onboarding/company"); // next step
  }

  return (
    <form onSubmit={onNext} className="space-y-4 sm:space-y-6">
      {err && <div className="text-sm text-rose-300 bg-rose-500/10 border border-rose-400/30 rounded-md px-3 py-2">Error: {err}</div>}

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

      <div className="auth-wizard-actions justify-center mt-3">
        <Link
          to="/onboarding/company"
          className="auth-link inline-flex items-center justify-center"
        >
          Skip
        </Link>
      </div>
    </form>
  );
}
