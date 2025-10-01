// src/features/landing/Landing.tsx
import React from "react"
import Hero from "./Hero"

export default function Landing() {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
            {/* Hero Section */}
            <Hero />

            {/* Later we’ll add: <Features />, <Testimonials />, <CTA />, <FAQ />, <Footer /> */}
        </div>
    )
}
