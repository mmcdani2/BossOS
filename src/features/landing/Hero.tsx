// src/features/landing/Hero.tsx

export default function Hero() {
    return (
        <section className="relative isolate overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20 lg:px-8">
                {/* Text block */}
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-400">
                        The Operating System for Service Businesses
                    </h1>
                    <p className="mt-6 text-lg text-gray-300">
                        Run HVAC, Spray Foam, Plumbing, and more—smarter, faster, with total control.
                    </p>
                </div>

                {/* Call-to-actions */}
                <div className="mt-8 flex items-center justify-center gap-4">
                    <button className="rounded-xl px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg">
                        Get Started Free
                    </button>
                    <button className="rounded-xl px-6 py-3 bg-white/10 border border-white/15 hover:bg-white/20 text-gray-200">
                        See BossOS in Action
                    </button>
                </div>

                {/* Visual placeholder */}
                <div className="mt-12 w-full max-w-5xl mx-auto">
                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl flex items-center justify-center text-gray-500">
                        Dashboard Mockup Placeholder
                    </div>
                </div>
            </div>
        </section>
    )
}
