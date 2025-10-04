// src/app/layouts/PublicLayout.tsx
import { Outlet } from "react-router-dom";
import ThemeToggleSwitch from "@/ui/components/navigation/ThemeToggleButton";

// PublicLayout is a simple shell for marketing/public routes
export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-end px-6 py-6 sm:px-10">
        <ThemeToggleSwitch />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
