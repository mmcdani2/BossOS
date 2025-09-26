import { useEffect, useMemo, useState } from "react";

type Phase = "verifying" | "fetching" | "routing" | "error";

export default function AuthTransition({
  phase,
  message,
  subMessage,
  show,
}: {
  phase: Phase;
  message?: string;
  subMessage?: string;
  show: boolean;
}) {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 450);
    return () => clearInterval(id);
  }, []);

  const label = useMemo(() => {
    if (message) return message;
    if (phase === "verifying") return "Verifying";
    if (phase === "fetching") return "Fetching profile";
    if (phase === "routing") return "Routing";
    if (phase === "error") return "Something went wrong";
    return "Working";
  }, [phase, message]);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Subtle branded background glow / particles */}
      <div className="absolute inset-0 -z-10 auth-transition-bg" />

      {/* Center content */}
      <div className="grid h-full place-items-center">
        <div className="flex flex-col items-center gap-4">
          {/* Logo / mark circle */}
          <div className="size-16 rounded-full grid place-items-center animate-pulse-soft bg-[color:var(--surface-2)]/40 backdrop-blur-md border border-white/10 shadow-lg">
            {/* Replace with your SVG if you want */}
            <div className="size-8 rounded-xl bg-[color:var(--brand)]/90 auth-logo-glow" />
          </div>

          {/* Status text */}
          <div role="status" aria-live="polite" className="text-center">
            <div className="text-base font-medium tracking-wide text-[color:var(--text)] dark:text-white">
              {label}
              {phase !== "error" ? <span aria-hidden="true">{dots}</span> : null}
            </div>
            {subMessage ? (
              <div className="mt-1 text-sm text-[color:var(--text-subtle)]">
                {subMessage}
              </div>
            ) : null}
          </div>

          {/* Error actions */}
          {phase === "error" && (
            <div className="mt-2 flex gap-2">
              <button
                className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-sm"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
              <a
                className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-sm"
                href="/signin"
              >
                Back to Sign In
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
