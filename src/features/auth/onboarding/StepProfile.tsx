import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { upsertProfile } from "@/lib/api/profiles";
import { supabase } from "@/lib/supabase/client";

export default function StepProfile() {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onNext(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("You must be signed in."); setBusy(false); return; }

    const { error } = await upsertProfile(user.id, { full_name: name || undefined });
    if (error) setErr(error.message);
    else navigate("/onboarding/company");
    setBusy(false);
  }

  return (
    <form onSubmit={onNext} className="space-y-4 sm:space-y-6">
      {err && <div className="text-sm text-rose-300 bg-rose-500/10 border border-rose-400/30 rounded-md px-3 py-2">Error: {err}</div>}

      <div className="relative">
        <input
          className="w-full rounded-xl px-4 py-3 bg-slate-800/30 text-white placeholder-slate-400 border border-slate-700/50 outline-none transition-all duration-300 focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="auth-wizard-actions">
        <button type="button" className="auth-btn-secondary" onClick={() => navigate("/onboarding/company")}>
          Skip
        </button>
        <button className="auth-btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Continue"}
        </button>
      </div>
    </form>
  );
}
