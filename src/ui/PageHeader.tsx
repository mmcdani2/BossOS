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
    <div className="
  sticky top-0 z-40
  bg-surface-2 backdrop-blur border-b border-token
">
      {/* full-width row with fixed, safe padding from viewport edges */}
      <div
        className="
          h-16 flex items-center justify-between gap-3
          [padding-inline:max(env(safe-area-inset-left),1rem)]
          md:[padding-inline:max(env(safe-area-inset-left),1.5rem)]
          lg:[padding-inline:max(env(safe-area-inset-left),2rem)]
          /* right side mirrors left safe-area */
          [padding-inline-end:max(env(safe-area-inset-right),1rem)]
          md:[padding-inline-end:max(env(safe-area-inset-right),1.5rem)]
          lg:[padding-inline-end:max(env(safe-area-inset-right),2rem)]
        "
      >
        {/* Left: static brand + optional titles */}
        <div className="min-w-0 flex items-center gap-3">
          <div className="nav-brand text-basecolor font-semibold">Boss.OS</div>
          {(title || subtitle) && (
            <div className="min-w-0">
              {title && (
                <h1 className="text-xl font-semibold text-basecolor leading-none truncate">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-muted/60 text-sm leading-tight truncate">
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
