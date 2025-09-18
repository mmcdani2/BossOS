import { ReactNode } from "react";

export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="
        sticky top-14 z-10 -mx-3 px-3 py-3
        bg-black/30 backdrop-blur border-b border-white/10
      "
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          {subtitle && <p className="text-white/60 text-sm">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
