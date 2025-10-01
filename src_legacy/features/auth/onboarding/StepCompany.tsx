import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import GlassDropdown from "@/ui/GlassDropdown";

type TzOption = { value: string; label: string };

// Minimal curated list + detected tz first
const COMMON_TZS: TzOption[] = [
  { value: "America/Chicago", label: "America/Chicago (CT)" },
  { value: "America/New_York", label: "America/New_York (ET)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PT)" },
  { value: "UTC", label: "UTC" },
];

export default function StepCompany() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [tz, setTz] = useState<string>("UTC");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Detect local timezone once
  useEffect(() => {
    try {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (local) setTz(local);
    } catch {
      // keep default UTC
    }
  }, []);

  const tzOptions = useMemo<TzOption[]>(() => {
    const base = COMMON_TZS.map((o) => o.value);
    if (!tz || base.includes(tz)) return COMMON_TZS;
    // Put detected tz at the top if it's not in our shortlist
    return [{ value: tz, label: `${tz} (detected)` }, ...COMMON_TZS];
  }, [tz]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    const trimmed = name.trim();
    if (!trimmed) {
      setErr("Please enter your company name.");
      return;
    }

    setBusy(true);
    setErr(null);

    // Ensure user
    const { data: userRes, error: uErr } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (uErr || !user) {
      setErr("You must be signed in.");
      setBusy(false);
      return;
    }

    // 1) Create organization
    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .insert({
        name: trimmed,
        timezone: tz || "UTC",
      })
      .select()
      .single();

    if (orgErr || !org) {
      setErr(orgErr?.message ?? "Failed to create organization.");
      setBusy(false);
      return;
    }

    // 2) Link user ←→ org (owner)
    const { error: memErr } = await supabase
      .from("memberships")
      .insert({ user_id: user.id, org_id: org.id, role: "owner" });

    if (memErr) {
      // Not fatal for UI flow; but surface it so you can fix RLS if needed
      console.debug("[StepCompany] membership insert error:", memErr);
      setErr("Organization was created but we couldn’t link your membership. Please contact support.");
      setBusy(false);
      return;
    }

    // 3) Advance
    navigate("/onboarding/preferences");
  }

  return (
    <form onSubmit={handleSubmit} className="form" noValidate>
      {err && (
        <div className="form-banner--error" role="alert" aria-live="polite">
          {err}
        </div>
      )}

      <div className="space-y-2">
        <input
          id="org-name"
          name="organization"
          autoComplete="organization"
          className="form-input form-input--center"
          placeholder="Enter Your Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-invalid={!!err && !name.trim()}
        />
      </div>

      <div className="space-y-2 mt-4">

        <GlassDropdown
          id="tz"
          name="timezone"
          value={tz}
          options={tzOptions}
          onChange={setTz}
        />

      </div>

      <div className="auth-wizard-actions mt-6">
        <button className="btn-primary" disabled={busy || !name.trim()}>
          {busy ? "Creating…" : "Continue"}
        </button>
      </div>
      <div className="link text-center mt-3">
        <Link to="/onboarding/preferences" className="link">
          Skip
        </Link>
      </div>
    </form>
  );
}
