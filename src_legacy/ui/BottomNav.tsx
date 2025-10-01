import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  ClipboardCheck,
  FileText,
  ReceiptText,
  Users,
  Boxes,
} from "lucide-react";

type Tab = {
  to: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const TABS: Tab[] = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/scheduling", label: "Schedule", Icon: CalendarClock },
  { to: "/jobs", label: "Jobs", Icon: ClipboardCheck },
  { to: "/estimates", label: "Estimates", Icon: FileText },
  { to: "/billing", label: "Invoices", Icon: ReceiptText },
  { to: "/crm", label: "Customers", Icon: Users },
  { to: "/inventory", label: "Inventory", Icon: Boxes },
];

export default function BottomNav() {
  return (
    <div
      aria-label="Primary navigation"
      className="
        fixed inset-x-0 bottom-0 z-50
        px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)]
      "
    >
      {/* glass container */}
      <div
        className="
          mx-auto max-w-[1100px]
          glass rounded-2xl p-2
        "
      >
        <nav>
          <ul className="flex items-center justify-between gap-1">
            {TABS.map(({ to, label, Icon }) => {
              const isDashboard = to === "/";

              return (
                <li key={label} className="flex-1 min-w-0">
                  <NavLink
                    to={to}
                    end={isDashboard || undefined}
                    aria-label={label}
                    className={({ isActive }) =>
                      [
                        // base
                        "group flex flex-col items-center gap-1 rounded-xl px-3 py-2",
                        "text-basecolor transition-colors border border-transparent",
                        "focus-visible:outline-none focus-visible:ring-token",

                        // hover (token mix on surface so it works in both themes)
                        "hover:[background:color-mix(in_srgb,var(--surface-3)_92%,transparent)]",

                        // active state: subtle fill + brand-tinted ring/border
                        isActive
                          ? [
                              "border-token",
                              "[background:color-mix(in_srgb,var(--surface-3)_94%,transparent)]",
                              // optional inner softness to mimic pressed/glass
                              "shadow-inner",
                              // brand-tinted text/icon without forcing white
                              "[color:color-mix(in_srgb,var(--brand)_60%,var(--text))]",
                            ].join(" ")
                          : "",
                      ].join(" ")
                    }
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                    <span className="text-[11px] leading-none">{label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
