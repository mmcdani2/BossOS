import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { upsertProfile } from "@/lib/api/profiles";
import { updateOrganization } from "@/lib/api/organizations";

type Industry = "home-services" | "construction" | "field-services" | "other";
type Currency = "USD" | "CAD" | "EUR" | "GBP";
type Units = "imperial" | "metric";

export default function StepPreferences() {
  const [industry, setIndustry] = useState<Industry>("home-services");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [units, setUnits] = useState<Units>("imperial");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onFinish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("You must be signed in."); setBusy(false); return; }

    const { data: ms, error: msErr } = await supabase
      .from("memberships")
      .select("org_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (msErr) { setErr(msErr.message); setBusy(false); return; }
    const orgId = ms?.[0]?.org_id as string | undefined;

    if (orgId) {
      const { error: orgUpdateErr } = await updateOrganization(orgId, { industry, currency, units });
      if (orgUpdateErr) { setErr(orgUpdateErr.message); setBusy(false); return; }
    }

    const { error } = await upsertProfile(user.id, { onboarding_complete: true });
    if (error) { setErr(error.message); setBusy(false); return; }

    navigate("/onboarding/done");
  }

  return (
    <form onSubmit={onFinish} className="auth-form">
      {err && (
        <div className="auth-banner-error" role="alert" aria-live="polite">
          Error: {err}
        </div>
      )}

      <div className="relative">
        <label htmlFor="industry" className="sr-only">Industry</label>
        <select
          id="industry"
          name="industry"
          className="auth-select"
          value={industry}
          onChange={(e) => setIndustry(e.target.value as Industry)}
        >
          <option value="home-services">Home Services</option>
          <option value="construction">Construction</option>
          <option value="field-services">Field Services</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="relative">
        <label htmlFor="currency" className="sr-only">Currency</label>
        <select
          id="currency"
          name="currency"
          autoComplete="currency"
          className="auth-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
        >
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      <div className="relative">
        <label htmlFor="units" className="sr-only">Units</label>
        <select
          id="units"
          name="units"
          className="auth-select"
          value={units}
          onChange={(e) => setUnits(e.target.value as Units)}
        >
          <option value="imperial">Imperial</option>
          <option value="metric">Metric</option>
        </select>
      </div>

      <div className="auth-wizard-actions">
        <button
          type="button"
          className="auth-btn-secondary"
          onClick={() => navigate("/onboarding/done")}
          disabled={busy}
        >
          Skip
        </button>
        <button className="auth-btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Finish"}
        </button>
      </div>
    </form>
  );
}
