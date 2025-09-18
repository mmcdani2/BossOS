// src/ui/PageHeader.tsx
import { ReactNode } from "react";
import UserMenu from "./UserMenu";

export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title?: string;     // optional, only use on pages that *don't* have a toolbar
  subtitle?: string;  // optional
  action?: ReactNode; // optional right-side actions
}) {
  return (
    <div
      className="
        sticky top-0 z-40 -mx-3 px-3
        bg-black/30 backdrop-blur border-b border-white/10
        supports-[backdrop-filter]:bg-black/20
      "
    >
      <div className="max-w-[1200px] mx-auto h-16 flex items-center justify-between gap-3">
        {/* Left: static brand + optional titles */}
        <div className="min-w-0 flex items-center gap-3">
          <div className="nav-brand text-white font-semibold">Boss.OS</div>
          {(title || subtitle) && (
            <div className="min-w-0">
              {title && (
                <h1 className="text-xl font-semibold text-white leading-none truncate">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-white/60 text-sm leading-tight truncate">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: actions + UserMenu */}
        <div className="flex items-center gap-2">
          {action}
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
