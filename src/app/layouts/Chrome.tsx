// Main layout shell with sidebar + main content

import { Outlet } from "react-router-dom";

// Chrome layout provides app-wide scaffolding
export default function Chrome() {
    // return overall layout
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar placeholder */}
            <aside className="w-64 border-r border-default-200/80 bg-default-50/80 backdrop-blur-sm dark:border-default-200/20 dark:bg-default-50/10">
                {/* TODO: add navigation here */}
            </aside>

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto bg-background">
                {/* Outlet renders current route */}
                <Outlet />
            </main>
        </div>
    );
}
