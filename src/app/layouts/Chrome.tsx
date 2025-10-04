// Main layout shell with sidebar + main content
import { Outlet } from "react-router-dom";

// Chrome layout provides app-wide scaffolding
export default function Chrome() {
    // return overall layout
    return (
        <div className="flex min-h-screen bg-background text-foreground">

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto bg-background">
                {/* Outlet renders current route */}
                <Outlet />
            </main>
        </div>
    );
}
