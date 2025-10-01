// src/ui/PageHeader.tsx
import { ReactNode } from "react";
import UserMenu from "./UserMenu";

export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="
        sticky top-0 z-40
        backdrop-blur
        border-b border-token
        bg-[color:var(--surface-2)]/55
        shadow-[0_1px_0_rgba(255,255,255,0.05)]
      "
    >
      <div
        className="
          h-16 flex items-center justify-between gap-3
          [padding-inline:max(env(safe-area-inset-left),1rem)]
          md:[padding-inline:max(env(safe-area-inset-left),1.5rem)]
          lg:[padding-inline:max(env(safe-area-inset-left),2rem)]
          [padding-inline-end:max(env(safe-area-inset-right),1rem)]
          md:[padding-inline-end:max(env(safe-area-inset-right),1.5rem)]
          lg:[padding-inline-end:max(env(safe-area-inset-right),2rem)]
        "
      >
        {/* Left: brand + optional titles */}
        <div className="min-w-0 flex items-center gap-3">
          <div
            className="
              font-extrabold tracking-tight leading-none select-none
              text-transparent bg-clip-text
              bg-[linear-gradient(90deg,#f59e0b,#ef4444)]
            "
            style={{ fontSize: "1.25rem" }}
          >
            Boss.OS
          </div>

          {(title || subtitle) && (
            <div className="min-w-0">
              {title && (
                <h1 className="text-basecolor text-lg md:text-xl font-semibold leading-none truncate">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-white/60 leading-tight truncate">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: actions + user */}
        <div className="flex items-center gap-2">
          {action && (
            <div
              className="
                hidden sm:flex items-center
                rounded-xl px-2 py-1.5
                bg-[color:var(--surface-3)]/40
                border border-white/10
                shadow-[0_1px_0_rgba(255,255,255,0.04)]
                hover:bg-[color:var(--surface-3)]/55 transition
              "
            >
              {action}
            </div>
          )}
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
