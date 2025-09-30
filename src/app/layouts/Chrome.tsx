// Main layout shell with sidebar + main content

import { Outlet } from "react-router-dom";

// Chrome layout provides app-wide scaffolding
export default function Chrome() {
    // return overall layout
    return (
        <div className="flex min-h-screen">
            {/* Sidebar placeholder */}
            <aside className="w-64 border-r border-gray-200 bg-white dark:bg-slate-900">
                {/* TODO: add navigation here */}
            </aside>

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto">
                {/* Outlet renders current route */}
                <Outlet />
            </main>
        </div>
    );
}
