// src/ui/components/navigation/ThemeToggleButton.tsx
// Simple theme toggle button using Tailwind's `dark` class strategy

import React from "react";

export default function ThemeToggleButton() {
    // Toggle Tailwind dark mode class on <html>
    const toggleTheme = () => {
        const root = document.documentElement;
        const isDark = root.classList.contains("dark");
        const nextTheme = isDark ? "light" : "dark";

        root.classList.toggle("dark", nextTheme === "dark");
        root.dataset.theme = nextTheme;
        localStorage.setItem("theme", nextTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
            Toggle Theme
        </button>
    );
}
