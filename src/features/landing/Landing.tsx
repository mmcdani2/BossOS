// src/features/landing/Landing.tsx
import React from "react"
import Hero from "./Hero"

export default function Landing() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-950 text-gray-50">
            {/* Hero Section */}
            <Hero />

            {/* Later we’ll add: <Features />, <Testimonials />, <CTA />, <FAQ />, <Footer /> */}
        </div>
    )
}
