// src/features/onboarding/StepProfile.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { upsertProfile } from "@/lib/api/profiles";
import { supabase } from "@/lib/supabase/client";
import { GlassDropdown } from "@/ui/GlassDropdown";

const ALLOWED_ROLES = ["owner", "admin"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

export default function StepProfile() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<AllowedRole | "">("");
  const [phone, setPhone] = useState("");
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

    // Validate role
    if (!role || !ALLOWED_ROLES.includes(role)) {
      setErr("Please choose a role (owner or admin).");
      setBusy(false);
      return;
    }

    // Optional: light phone normalization (trim only)
    const full_name = name.trim() || null;
    const phoneVal = phone.trim() || null;

    const { error } = await upsertProfile(user.id, {
      full_name,
      role, // new
      phone: phoneVal, // uses existing 'phone' column on profiles
      onboarding_step: 2, // optional: advance wizard progress
    });

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

      {/* Name (optional) */}
      <div className="relative">
        <input
          className="auth-input auth-input--center"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </div>

      {/* Role (required: owner/admin) */}
      <div className="relative mt-3">
        <GlassDropdown
          id="role"
          name="role"
          value={role}
          options={[
            { value: "", label: "Select role (owner/admin)" },
            { value: "owner", label: "Owner" },
            { value: "admin", label: "Admin" },
          ]}
          onChange={(val) => setRole(val as AllowedRole | "")}
        />
      </div>

      {/* Phone (optional) */}
      <div className="relative mt-3">
        <input
          className="auth-input auth-input--center"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="tel"
          autoComplete="tel"
        />
      </div>

      <div className="auth-wizard-actions mt-4">
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
