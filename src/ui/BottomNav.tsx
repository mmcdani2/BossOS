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
      <div
        className="
          mx-auto max-w-[1100px]
          rounded-2xl border border-white/10
          bg-white/10 backdrop-blur-2xl shadow-2xl
          p-2
        "
      >
        <nav>
          <ul className="flex items-center justify-between gap-1">
            {TABS.map(({ to, label, Icon }) => {
              const base =
                "group flex flex-col items-center gap-1 rounded-xl px-3 py-2 " +
                "text-white/70 hover:text-white transition " +
                "border border-transparent hover:border-white/10 hover:bg-white/10";
              const content = (
                <>
                  <Icon className="h-5 w-5" aria-hidden />
                  <span className="text-[11px] leading-none">{label}</span>
                </>
              );

              const isDashboard = to === "/";

              return (
                <li key={label} className="flex-1 min-w-0">
                  <NavLink
                    to={to}
                    // 'end' makes "/" active only on exact "/"
                    end={isDashboard || undefined}
                    aria-label={label}
                    className={({ isActive }) =>
                      [
                        base,
                        isActive
                          ? "bg-indigo-400/20 text-white border-indigo-400/40 shadow-inner"
                          : "",
                      ].join(" ")
                    }
                  >
                    {content}
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
