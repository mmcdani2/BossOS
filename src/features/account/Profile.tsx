import React, { useEffect, useState } from "react";
import PageHeader from "@/ui/PageHeader";
import ViewToolbar from "@/ui/ViewToolbar";
import GlassCard from "@/ui/GlassCard";
import { supabase } from "@/lib/supabase/client";
import { Camera, Save } from "lucide-react";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const meta = u.user?.user_metadata ?? {};
      setEmail(u.user?.email ?? "");
      setName(meta.full_name ?? meta.name ?? "");
      setPhone(meta.phone ?? "");
    })();
  }, []);

  const onSave = async () => {
    setSaving(true); setMsg(null);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, phone },
    });
    setSaving(false);
    setMsg(error ? error.message : "Saved!");
  };

  return (
    <>
      <PageHeader />
      <div className="shell page-viewport">
        {/* Toolbar */}
        <div
          className="sticky-under-nav"
          style={{ top: "calc(var(--nav-h) - 64px)" }}
        >
          <GlassCard className="p-3">
            <ViewToolbar
              label="Profile"
              right={
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[9px] border border-white/20 bg-white/10 text-slate-200 hover:bg-white/15"
                >
                  <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
                </button>
              }
            />
          </GlassCard>
        </div>

        {/* Form */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* Left: basic info */}
          <GlassCard className="p-4">
            <div className="text-white/80 font-medium mb-3">Account</div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <input
              value={email}
              disabled
              className="w-full h-9 rounded-md bg-white/5 border border-white/10 px-3 text-white/80 mb-3"
              placeholder="Email"
            />

            <label className="block text-sm text-white/70 mb-1">Full name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-9 rounded-md bg-white/5 border border-white/10 px-3 text-white mb-3"
              placeholder="Full name"
            />

            <label className="block text-sm text-white/70 mb-1">Phone</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full h-9 rounded-md bg-white/5 border border-white/10 px-3 text-white"
              placeholder="Phone"
            />
          </GlassCard>

          {/* Right: avatar & password */}
          <GlassCard className="p-4">
            <div className="text-white/80 font-medium mb-3">Avatar</div>
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-white/10 border border-white/10" />
              <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[9px] border border-white/20 bg-white/10 text-slate-200 hover:bg-white/15">
                <Camera className="h-4 w-4" /> Upload
              </button>
            </div>

            <div className="h-5" />
            <div className="text-white/80 font-medium mb-3">Password</div>
            <ChangePassword />
          </GlassCard>
        </div>

        {msg && <div className="mt-3 text-sm text-emerald-300">{msg}</div>}
      </div>
    </>
  );
}

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSave() {
    try {
      setSaving(true);
      setMsg(null);
      setErr(null);

      // Supabase: update password for the current signed-in user
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMsg("Password updated");
      setPassword("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to update password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <label htmlFor="new-password" className="block text-sm text-white/70 mb-1">
        New password
      </label>
      <input
        id="new-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full h-9 rounded-md bg-white/5 border border-white/10 px-3 text-white mb-2"
        placeholder="New password"
        autoComplete="new-password"
      />
      <button
        onClick={onSave}
        disabled={saving || password.length < 8}
        className="px-3 py-1.5 rounded-[9px] border border-white/20 bg-white/10 text-slate-200 hover:bg-white/15 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Update password"}
      </button>

      {err && <div className="mt-2 text-sm text-rose-300">{err}</div>}
      {msg && <div className="mt-2 text-sm text-emerald-300">{msg}</div>}
    </div>
  );
}