/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import PageHeader from "@/ui/PageHeader";
import ViewToolbar from "@/ui/ViewToolbar";
import GlassCard from "@/ui/GlassCard";
import UiSelect from "@/ui/UiSelect";
import { useUserPrefs } from "./useUserPrefs";
import { Save } from "lucide-react";

const TZ_OPTS = [
  { label: "System", value: "" },
  { label: "America/Chicago", value: "America/Chicago" },
  { label: "America/New_York", value: "America/New_York" },
  { label: "America/Los_Angeles", value: "America/Los_Angeles" },
  { label: "UTC", value: "UTC" },
];

export default function Preferences() {
  const { prefs, save, loading, saving, error } = useUserPrefs();

  const [timezone, setTimezone] = React.useState(prefs?.timezone ?? "");
  const [dateFmt, setDateFmt] = React.useState(prefs?.date_format ?? "MM/dd/yyyy");
  const [firstDay, setFirstDay] = React.useState<number>(prefs?.first_day_of_week ?? 0);
  const [theme, setTheme] = React.useState<"system"|"dark"|"light">( (prefs?.theme as any) ?? "system");
  const [notif, setNotif] = React.useState(prefs?.notifications ?? { email: true, push: false, jobs: true, invoices: true });

  React.useEffect(() => {
    if (!loading && prefs) {
      setTimezone(prefs.timezone ?? "");
      setDateFmt(prefs.date_format ?? "MM/dd/yyyy");
      setFirstDay(prefs.first_day_of_week ?? 0);
      setTheme((prefs.theme as any) ?? "system");
      setNotif(prefs.notifications ?? { email: true, push: false, jobs: true, invoices: true });
    }
  }, [loading, prefs]);

  React.useEffect(() => {
  const apply = (mode: "light" | "dark") =>
    document.documentElement.setAttribute("data-theme", mode);

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const resolve = () => {
    const choice = (theme ?? "system") as "system" | "light" | "dark";
    if (choice === "system") {
      apply(media.matches ? "dark" : "light");
    } else {
      apply(choice);
    }
  };

  resolve(); // apply immediately (on mount & when `theme` changes)

  // if “System”, follow OS changes too
  const onChange = () => {
    if ((theme ?? "system") === "system") resolve();
  };
  media.addEventListener?.("change", onChange);
  return () => media.removeEventListener?.("change", onChange);
}, [theme]);

  const onSave = async () => {
    await save({ timezone, date_format: dateFmt, first_day_of_week: firstDay, theme, notifications: notif });
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
              label="Preferences"
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

        {/* Groups */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <GlassCard className="p-4">
            <div className="text-white/80 font-medium mb-3">Localization</div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-white/70 mb-1">Timezone</div>
                <UiSelect
                  value={timezone ?? ""}
                  onChange={(v)=>setTimezone(v)}
                  width="100%"
                  options={TZ_OPTS}
                />
              </div>

              <div>
                <div className="text-sm text-white/70 mb-1">Date format</div>
                <input value={dateFmt} onChange={e=>setDateFmt(e.target.value)}
                       className="w-full h-9 rounded-md bg-white/5 border border-white/10 px-3 text-white" />
              </div>

              <div>
                <div className="text-sm text-white/70 mb-1">First day of week</div>
                <UiSelect
                  value={String(firstDay)}
                  onChange={(v)=>setFirstDay(parseInt(v))}
                  width="100%"
                  options={[
                    { label: "Sunday", value: "0" },
                    { label: "Monday", value: "1" },
                  ]}
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="text-white/80 font-medium mb-3">Appearance</div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-white/70 mb-1">Theme</div>
                <UiSelect
                  value={theme}
                  onChange={(v)=>setTheme(v as any)}
                  width="100%"
                  options={[
                    { label: "System", value: "system" },
                    { label: "Dark", value: "dark" },
                    { label: "Light", value: "light" },
                  ]}
                />
              </div>
            </div>

            <div className="h-4" />
            <div className="text-white/80 font-medium mb-3">Notifications</div>
            <div className="space-y-2">
              {[
                ["Email", "email"],
                ["Push", "push"],
                ["Jobs updates", "jobs"],
                ["Invoices updates", "invoices"],
              ].map(([label, key]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={!!(notif as any)[key]}
                    onChange={e=>setNotif({...notif, [key]: e.target.checked} as any)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </GlassCard>
        </div>

        {error && <div className="mt-3 text-sm text-rose-300">{error}</div>}
      </div>
    </>
  );
}
