import { Outlet, useLocation } from "react-router-dom";
import Logo from "@/ui/Logo";

const steps = ["", "company", "preferences", "done"]; // '' = /onboarding (profile)

export default function OnboardingShell() {
  const { pathname } = useLocation();
  const activeIdx = steps.findIndex((s) =>
    pathname.endsWith("/onboarding") ? s === "" : pathname.includes(`/onboarding/${s}`)
  );

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 auth-grid-overlay backdrop-blur-[2px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="relative w-full max-w-md">
        <div className="relative w-full max-w-md bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-slate-900/50 p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <Logo />
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Let’s get you set up
            </h1>
            <p className="mt-1 text-sm text-slate-300/80">
              A few quick steps to personalize your workspace.
            </p>
          </div>

          {/* Progress dots */}
          <div className="auth-wizard-steps">
            {steps.slice(0, 3).map((_, i) => (
              <span key={i} className={`auth-wizard-step ${i === (activeIdx === -1 ? 0 : Math.min(activeIdx, 2)) ? "is-active" : ""}`} />
            ))}
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
