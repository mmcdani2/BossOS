// src/features/account/Settings.tsx
import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/ui/PageHeader";
import ViewToolbar from "@/ui/ViewToolbar";
import GlassCard from "@/ui/GlassCard";
import { ChevronRight } from "lucide-react";

type Item = { label: string; to: string; desc?: string };
type Group = { title: string; key: string; items: Item[] };

const GROUPS: Group[] = [
  {
    key: "company",
    title: "Company",
    items: [
      { label: "Company Profile", to: "/account/settings/company/profile", desc: "Name, logo, contact info, tax ID" },
      { label: "Business Settings", to: "/account/settings/company/business", desc: "Time zone, currency, tax defaults" },
      { label: "Hours & Availability", to: "/account/settings/company/hours" },
      { label: "Service Areas", to: "/account/settings/company/service-areas" },
      { label: "Branding", to: "/account/settings/company/branding", desc: "Colors, templates, logos" },
      { label: "People & Access", to: "/account/settings/company/people" },
      { label: "Teams & Permissions", to: "/account/settings/company/permissions", desc: "Roles, access control" },
      { label: "Login & Authentication", to: "/account/settings/company/auth", desc: "MFA, SSO, password policy" },
      { label: "Time Tracking", to: "/account/settings/company/time-tracking", desc: "Clock-in rules, geofencing, rounding" },
      { label: "Commissions", to: "/account/settings/company/commissions", desc: "Plans, rates" },
    ],
  },
  {
    key: "pricing",
    title: "Products & Pricing",
    items: [
      { label: "Price Book", to: "/account/settings/pricing/price-book", desc: "Items, bundles, labor, materials" },
      { label: "Material Tracking", to: "/account/settings/pricing/material-tracking", desc: "Optional add-on" },
      { label: "Job Costing Defaults", to: "/account/settings/pricing/job-costing", desc: "Burden %, overhead %" },
    ],
  },
  {
    key: "checklists",
    title: "Checklists Library",
    items: [{ label: "Templates", to: "/account/settings/checklists/templates" }],
  },
  {
    key: "workflows",
    title: "Workflows",
    items: [
      { label: "Jobs", to: "/account/settings/workflows/jobs", desc: "Custom fields, required info, signatures, appointments" },
      { label: "Estimates", to: "/account/settings/workflows/estimates", desc: "Defaults, validity, customer view, emails/SMS" },
      { label: "Invoices", to: "/account/settings/workflows/invoices", desc: "Terms, deposits, reminders, automations" },
      { label: "Templates", to: "/account/settings/workflows/templates", desc: "Jobs, estimates, invoices, checklists, docs" },
      { label: "Automations", to: "/account/settings/workflows/automations", desc: "Status → comms, tasks, reminders" },
    ],
  },
  {
    key: "comms",
    title: "Communications",
    items: [
      { label: "Channels", to: "/account/settings/comms/channels", desc: "SMS, email, voice" },
      { label: "Message Templates", to: "/account/settings/comms/templates", desc: "Reminders, follow-ups, review asks" },
      { label: "Notifications", to: "/account/settings/comms/notifications", desc: "User/admin level" },
      { label: "Customer Portal", to: "/account/settings/comms/portal", desc: "Access, visibility, automations" },
    ],
  },
  {
    key: "sales",
    title: "Sales & Marketing",
    items: [
      { label: "Lead Sources", to: "/account/settings/sales/lead-sources" },
      { label: "Pipeline", to: "/account/settings/sales/pipeline", desc: "Stages, SLAs" },
      { label: "Campaigns", to: "/account/settings/sales/campaigns", desc: "Email/SMS blasts" },
      { label: "Referrals & Review Requests", to: "/account/settings/sales/referrals" },
      { label: "Online Booking & Lead Forms", to: "/account/settings/sales/online-booking" },
    ],
  },
  {
    key: "finance",
    title: "Finance",
    items: [
      { label: "Payments", to: "/account/settings/finance/payments", desc: "Processor, deposits, tipping, surcharges" },
      { label: "Billing & Subscription", to: "/account/settings/finance/billing", desc: "Your SaaS plan, add-ons" },
      { label: "Accounting Integrations", to: "/account/settings/finance/accounting", desc: "QBO/Xero mappings" },
      { label: "Tax Rules", to: "/account/settings/finance/tax", desc: "Per jurisdiction" },
    ],
  },
  {
    key: "plans",
    title: "Service Plans",
    items: [
      { label: "Plan Catalog", to: "/account/settings/plans/catalog", desc: "Tiers, pricing, benefits" },
      { label: "Renewals", to: "/account/settings/plans/renewals", desc: "Auto-charge, reminders" },
      { label: "Compliance Logs", to: "/account/settings/plans/compliance", desc: "EPA/refrigerant, if enabled" },
    ],
  },
  {
    key: "inventory",
    title: "Inventory (optional)",
    items: [
      { label: "Locations", to: "/account/settings/inventory/locations", desc: "Warehouses, trucks" },
      { label: "Stock Levels & Reorder Rules", to: "/account/settings/inventory/reorder" },
      { label: "Receiving/Adjustments", to: "/account/settings/inventory/receiving" },
      { label: "Job Usage Tracking", to: "/account/settings/inventory/usage" },
    ],
  },
  {
    key: "addons",
    title: "Add-Ons",
    items: [
      { label: "FoamBoss / RoofBoss / Plumboss / PowerBoss", to: "/account/settings/addons", desc: "Inject their own config pages when installed" },
    ],
  },
];

export default function Settings() {
  const [selected, setSelected] = React.useState<string>(GROUPS[0].key);
  const selGroup = GROUPS.find(g => g.key === selected) ?? GROUPS[0];

  return (
    <>
      <PageHeader />

      {/* Page shell locked between header & bottom nav */}
      <div className="shell page-viewport" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Sticky toolbar right under PageHeader */}
        <div
          className="sticky-under-nav"
          style={{ top: "calc(var(--nav-h) - 64px)" }}
        >
          <GlassCard className="p-3">
            <ViewToolbar label="Settings" />
          </GlassCard>
        </div>

        {/* Two-pane layout (stacks on mobile) */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <div
            className="mt-4 grid gap-4 md:grid-cols-[280px_minmax(0,1fr)]"
            style={{
              paddingBottom: "calc(var(--bottom-nav-h) + 12px)",
              minHeight: 0,
              height: "100%",
            }}
          >
            {/* LEFT: category list */}
            <GlassCard className="p-0 overflow-hidden min-h-0">
              <div className="border-b border-white/10 px-4 py-3 text-white/90 font-semibold">
                Categories
              </div>
              <div className="overflow-auto" style={{ maxHeight: "100%" }}>
                {GROUPS.map((g) => {
                  const active = g.key === selected;
                  return (
                    <button
                      key={g.key}
                      onClick={() => setSelected(g.key)}
                      className={[
                        "w-full text-left px-4 py-2.5 border-b border-white/10",
                        "hover:bg-white/5 transition-colors",
                        active ? "bg-white/5 text-white font-semibold underline underline-offset-[6px] decoration-white/40" : "text-white/80",
                      ].join(" ")}
                    >
                      {g.title}
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* RIGHT: selected group items */}
            <GlassCard className="p-0 overflow-hidden min-h-0">
              <div className="overflow-auto scrollbar-hide" style={{ maxHeight: "100%" }}>
                <div className="divide-y divide-white/10">
                  {selGroup.items.map((it) => (
                    <Link key={it.to} to={it.to} className="group block px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-white/90 truncate group-hover:text-white">{it.label}</div>
                          {it.desc && <div className="text-white/50 text-xs truncate">{it.desc}</div>}
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white/60" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}
