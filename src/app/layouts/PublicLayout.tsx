// src/app/layouts/PublicLayout.tsx
import { Outlet } from "react-router-dom"
import ThemeToggleSwitch from "@/ui/components/navigation/ThemeToggleButton"

// PublicLayout is a simple shell for marketing/public routes
export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Top bar with theme toggle */}
            <header>
                <ThemeToggleSwitch />
            </header>

            {/* Public page content */}
            <Outlet />
        </div>
    )
}
