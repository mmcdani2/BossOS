"use client";
import ThemeToggleSwitch from "@/ui/components/navigation/ThemeToggleButton";

// src/app/layouts/OnboardingLayout.tsx
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
      <main className="flex-1">{children}</main>

      {/* HUD wrapper keeps toggle out of blur/canvas contexts */}
      <div className="fixed bottom-4 right-4 pointer-events-none">
        <div className="relative z-[999] isolate contain-paint pointer-events-auto">
          {/* keep your existing component import */}
          <ThemeToggleSwitch />
        </div>
      </div>
    </div>
  );
}

