"use client";
import { SparklesCore } from "@/components/ui/sparkles";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import ThemeToggleSwitch from "@/ui/components/navigation/ThemeToggleButton";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen flex-col bg-background text-foreground overflow-hidden">
            {/* 🔹 Background effect */}
            <div className="fixed inset-0 z-1 w-screen h-screen">
                <BackgroundRippleEffect/>
                <SparklesCore
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={140}
                    particleColor="#ffffff"
                    className="h-full w-full"
                />
            </div>

            {/* 🎨 Gradient overlay to fade bottom */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b
        from-background/10 
        via-background/70 
        to-background 
        dark:from-background/0 
        dark:via-background/80 
        dark:to-background"
            />

            {/* 🔹 Onboarding content */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
                {children}
            </main>
            <div className="fixed bottom-4 right-4 z-50">
                    <ThemeToggleSwitch />
                  </div>
        </div>
    );
}
