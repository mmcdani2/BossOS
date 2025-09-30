// src/app/layouts/PublicLayout.tsx
import { Outlet } from "react-router-dom"
import { HeroUIProvider, Switch } from "@heroui/react"
import { AuthProvider } from "../providers/AuthProvider"
import { useEffect, useState } from "react"

export default function PublicLayout() {
    const [darkMode, setDarkMode] = useState(
        () => document.documentElement.classList.contains("dark")
    )

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [darkMode])

    return (
        <HeroUIProvider>
            <AuthProvider>
                <div className="min-h-screen flex flex-col">
                    {/* Top bar with theme toggle */}
                    <header className="flex justify-end px-6 py-4">
                        <Switch
                            color="primary"
                            size="md"
                            isSelected={darkMode}
                            onValueChange={setDarkMode}
                            thumbIcon={() => (
                                <span className="text-xs">
                                    {darkMode ? "🌙" : "☀️"}
                                </span>
                            )}
                        />
                    </header>

                    {/* Public page content */}
                    <Outlet />
                </div>
            </AuthProvider>
        </HeroUIProvider>
    )
}
