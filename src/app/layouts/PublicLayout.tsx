// src/app/layouts/PublicLayout.tsx
import { Outlet, Link } from "react-router-dom";
import ScrollRevealHeader from "@/components/ui/ScrollRevealHeader";
import ThemeToggleSwitch from "@/ui/components/navigation/ThemeToggleButton";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Reveal-on-scroll, fixed header */}
      <ScrollRevealHeader>
        <header className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link to="/" className="font-semibold tracking-wide">
            BossOS
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-default-600 hover:text-foreground">Features</Link>
            <Link to="/pricing" className="text-default-600 hover:text-foreground">Pricing</Link>
            <Link to="/contact" className="text-default-600 hover:text-foreground">Contact</Link>
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
