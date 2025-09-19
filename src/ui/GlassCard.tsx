import { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
