import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrganization } from "@/lib/api/organizations";
import { addMembership } from "@/lib/api/memberships";
import { supabase } from "@/lib/supabase/client";

export default function StepCompany() {
  const [name, setName] = useState("");
  const [tz, setTz] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"); }
    catch { setTz("UTC"); }
  }, []);

  async function onNext(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || busy) return;
    setBusy(true);
    setErr(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("You must be signed in."); setBusy(false); return; }

    const { data: org, error: orgErr } = await createOrganization({
      name: name.trim(),
      timezone: tz,
    });
    if (orgErr || !org) { setErr(orgErr?.message || "Failed to create organization."); setBusy(false); return; }

    const addErr = (await addMembership(user.id, org.id, "owner")).error;
    if (addErr) { setErr(addErr.message); setBusy(false); return; }

    navigate("/onboarding/preferences");
  }

  return (
    <form onSubmit={onNext} className="auth-form">
      {err && (
        <div className="auth-banner-error" role="alert" aria-live="polite">
          Error: {err}
        </div>
      )}

      <div className="relative">
        <label htmlFor="org-name" className="sr-only">Company name</label>
        <input
          id="org-name"
          name="organization"
          autoComplete="organization"
          className="auth-input auth-input--center"
          placeholder="Acme Heating & Air"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="relative">
        <label htmlFor="tz" className="sr-only">Timezone</label>
        <select
          id="tz"
          name="timezone"
          className="auth-select"
          value={tz}
          onChange={(e) => setTz(e.target.value)}
        >
          <option value={tz || "UTC"}>{tz || "UTC"}</option>
          <option value="UTC">UTC</option>
          <option value="America/Chicago">America/Chicago</option>
          <option value="America/New_York">America/New_York</option>
          <option value="America/Los_Angeles">America/Los_Angeles</option>
        </select>
      </div>

      <div className="auth-wizard-actions">
        <button
          type="button"
          className="auth-btn-secondary"
          onClick={() => navigate("/onboarding/preferences")}
          disabled={busy}
        >
          Skip
        </button>
        <button className="auth-btn-primary" disabled={busy || !name.trim()}>
          {busy ? "Creating…" : "Continue"}
        </button>
      </div>
    </form>
  );
}
