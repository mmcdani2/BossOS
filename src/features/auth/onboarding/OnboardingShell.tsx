import { Outlet, useLocation } from "react-router-dom";
import Logo from "@/ui/Logo";

const steps = ["", "company", "preferences", "done"]; // '' = /onboarding (profile)

export default function OnboardingShell() {
  const { pathname } = useLocation();
  const isDone = pathname.endsWith("/onboarding/done");
  const activeIdx = steps.findIndex((s) =>
    pathname.endsWith("/onboarding") ? s === "" : pathname.includes(`/onboarding/${s}`)
  );

  return (
    <div className="auth-center auth-bg">
      <div className="auth-card glass-surface">
        {!isDone && (
          <div className="text-center mb-6 sm:mb-8">
            <Logo />
            <h1 className="auth-title">Let’s get you set up</h1>
            <p className="auth-subtext">A few quick steps to personalize your workspace.</p>
          </div>
        )}

        {!isDone && (
          <div className="auth-wizard-steps">
            {steps.slice(0, 3).map((_, i) => (
              <span
                key={i}
                className={`auth-wizard-step ${i === (activeIdx === -1 ? 0 : Math.min(activeIdx, 2)) ? "is-active" : ""
                  }`}
              />
            ))}
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
}
