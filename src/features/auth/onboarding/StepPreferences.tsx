import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { upsertProfile } from "@/lib/api/profiles";
import { updateOrganization } from "@/lib/api/organizations";
import { GlassDropdown } from "@/ui/GlassDropdown";

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
        <GlassDropdown
          id="industry"
          name="industry"
          value={industry}
          onChange={(v) => setIndustry(v as Industry)}
          options={[
            { value: "home-services", label: "Home Services" },
            { value: "construction", label: "Construction" },
            { value: "field-services", label: "Field Services" },
            { value: "other", label: "Other" },
          ]}
        />
      </div>

      <div className="relative">
        <label htmlFor="currency" className="sr-only">Currency</label>
        <GlassDropdown
          id="currency"
          name="currency"
          value={currency}
          onChange={(v) => setCurrency(v as Currency)}
          options={[
            { value: "USD", label: "USD" },
            { value: "CAD", label: "CAD" },
            { value: "EUR", label: "EUR" },
            { value: "GBP", label: "GBP" },
          ]}
        />
      </div>

      <div className="relative">
        <label htmlFor="units" className="sr-only">Units</label>
        <GlassDropdown
          id="units"
          name="units"
          value={units}
          onChange={(v) => setUnits(v as Units)}
          options={[
            { value: "imperial", label: "Imperial" },
            { value: "metric", label: "Metric" },
          ]}
        />
      </div>

      <div className="auth-wizard-actions">
        <button className="auth-btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Finish"}
        </button>
      </div>
      <div className="auth-wizard-links justify-center mt-3">
        <Link to="/onboarding/DONE" className="auth-link">
          Skip
        </Link>
      </div>
    </form>
  );
}
