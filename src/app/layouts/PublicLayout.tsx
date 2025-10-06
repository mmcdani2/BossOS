// src/app/layouts/PublicLayout.tsx
import { Outlet, Link } from "react-router-dom";
import ScrollRevealHeader from "@/components/ui/ScrollRevealHeader";
import ThemeToggleSwitch from "@/ui/components/navigation/ThemeToggleButton";
import React from "react";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Reveal-on-scroll, fixed header */}
      <ScrollRevealHeader>
        <header className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link
            to="/"
            className="text-xl font-bold tracking-wide text-foreground transition-all duration-100 ease-out hover:scale-105"
          >
            BossOS
          </Link>


          <nav className="hidden md:flex items-center gap-6">
            {[
              { to: "/features", label: "Features" },
              { to: "/pricing", label: "Pricing" },
              { to: "/contact", label: "Contact" },
            ].map((item, i, arr) => (
              <React.Fragment key={item.to}>
                <div className="group relative inline-flex items-center">
                  <Link
                    to={item.to}
                    className="relative inline-flex items-center text-default-800 transition-transform transition-colors duration-300 ease-out group-hover:text-foreground group-hover:scale-110"
                  >
                    {item.label}
                    <span
                      className="absolute left-1/2 bottom-[-6px] h-[2px] w-full origin-center scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100 -translate-x-1/2"
                    />
                  </Link>
                </div>
                {i < arr.length - 1 && <p className="text-default-800">|</p>}
              </React.Fragment>
            ))}
          </nav>

        </header>
      </ScrollRevealHeader>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Sticky theme toggle (independent from header) */}
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggleSwitch />
      </div>
    </div>
  );
}
