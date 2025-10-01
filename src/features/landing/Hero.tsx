// src/features/landing/Hero.tsx — REPLACE FILE
import { Button, Card, Chip } from "@heroui/react";

export default function Hero() {
    return (
        <section className="relative isolate overflow-hidden">
            {/* Atmospheric glow: neutral in light, faint gold in dark */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-b from-default/12 via-background/50 to-background dark:from-secondary/10 dark:via-background/40 dark:to-background"
            />

            <div className="mx-auto max-w-7xl px-6 pt-24 pb-20 sm:pt-32 lg:px-8">
                {/* Eyebrow */}
                <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                    <Chip
                        className="mb-6 border border-default/40 bg-default/10 text-default-700 shadow-sm dark:border-default/25 dark:bg-default/15 dark:text-default-300"
                        radius="full"
                        size="lg"
                        variant="flat"
                    >
                        BossOS • Built for Field Ops at Scale
                    </Chip>

                    {/* Headline: red → warm neutral → gold (no cyan) */}
                    <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
                        <span className="bg-gradient-to-r from-primary via-default-300 to-secondary bg-clip-text text-transparent dark:via-default-400">
                            The Operating System for Service Businesses
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg text-default-600 dark:text-default-400">
                        Replace stitched-together tools with one sleek command center—scheduling, pricebooks, jobs, AR, and KPIs—built for HVAC, spray foam, and plumbing.
                    </p>
                </div>

                {/* CTAs: primary = action (red), secondary = gold outline; neutral shadow */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Button
                        className="px-8 shadow-lg shadow-default/25"
                        color="primary"
                        radius="full"
                        size="lg"
                        variant="solid"
                    >
                        Get Started Free
                    </Button>
                    <Button
                        className="px-8"
                        color="secondary"
                        radius="full"
                        size="lg"
                        variant="bordered"
                    >
                        See BossOS in Action
                    </Button>
                </div>

                {/* Visual: neutral glass, no blue tint */}
                <Card
                    className="mx-auto mt-12 w-full max-w-5xl border border-default-200/60 bg-default-500/10 backdrop-blur-lg dark:border-default-200/30"
                    radius="lg"
                >
                    <div className="flex aspect-video w-full items-center justify-center text-base font-medium text-default-500">
                        Dashboard Mockup Placeholder
                    </div>
                </Card>

                {/* Micro trust strip */}
                <div className="mx-auto mt-8 max-w-5xl text-center">
                    <p className="text-sm text-default-400">
                        Trusted by fast-moving field teams replacing legacy stacks.
                    </p>
                </div>
            </div>
        </section>
    );
}
