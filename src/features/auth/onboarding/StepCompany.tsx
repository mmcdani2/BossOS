import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";

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

  // Replace your <select> with this component using the same props

  function GlassDropdown({
    id,
    name,
    value,
    options,
    onChange,
  }: {
    id: string;
    name: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
  }) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(
      Math.max(0, options.findIndex((o) => o.value === value))
    );
    const wrapRef = useRef<HTMLDivElement | null>(null);

    // close on click-out / Esc
    useEffect(() => {
      const onDoc = (e: MouseEvent) => {
        if (!open) return;
        if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (!open) return;
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("click", onDoc);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("click", onDoc);
        document.removeEventListener("keydown", onKey);
      };
    }, [open]);

    const selectAt = (i: number) => {
      const opt = options[i];
      if (!opt) return;
      onChange(opt.value);
      setActive(i);
      setOpen(false);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (!open) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, options.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); selectAt(active); }
      if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    };

    const label = options.find((o) => o.value === value)?.label ?? "Select…";

    return (
      <div ref={wrapRef} className="relative w-full overflow-visible z-[60]">
        {/* Hidden native select keeps form compatibility */}
        <select
          id={id}
          name={name}
          defaultValue={value}           // ← use defaultValue
          hidden
          aria-hidden="true"
          tabIndex={-1}
        >
          {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>

        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onKeyDown}
          className="form-input form-input--center w-full relative cursor-pointer"
        >
          <span className="block w-full text-center">{label}</span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70" aria-hidden>▾</span>
        </button>

        {open && (
          <ul
            id={`${id}-listbox`}
            role="listbox"
            className="absolute z-60 mt-2 w-full max-h-60 overflow-auto rounded-xl border border-white/20 bg-black/80 backdrop-blur-md shadow-xl text-center"
          >
            {options.map((o, i) => {
              const selected = o.value === value;
              const isActive = i === active;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()} // don't blur button
                  onClick={() => selectAt(i)}
                  className={`px-4 py-2 cursor-pointer ${isActive ? "bg-white/15 text-white" : "text-gray-200 hover:bg-white/10"
                    } ${selected ? "font-semibold" : ""}`}
                >
                  {o.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
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
