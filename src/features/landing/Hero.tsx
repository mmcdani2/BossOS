// src/features/landing/Hero.tsx

import { Button, Card, Chip } from "@heroui/react";

export default function Hero() {
    return (
        <section className="relative isolate overflow-hidden">
            {/* Soft atmospheric glow that adapts to both themes */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/15 via-background/60 to-background dark:from-primary/30 dark:via-background/30 dark:to-background"
            />

            <div className="mx-auto max-w-7xl px-6 pt-24 pb-20 sm:pt-32 lg:px-8">
                {/* Text block */}
                <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                    <Chip
                        className="mb-6 border border-secondary/40 bg-secondary/10 text-secondary-700 shadow-sm dark:border-secondary/25 dark:bg-secondary/15 dark:text-secondary-200"
                        radius="full"
                        size="lg"
                        variant="flat"
                    >
                        Built for modern field service teams
                    </Chip>

                    <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
                        <span className="bg-gradient-to-r from-primary via-primary/70 to-secondary bg-clip-text text-transparent">
                            The Operating System for Service Businesses
                        </span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg text-default-500">
                        Run HVAC, spray foam, plumbing, and more—smarter, faster, and with total control across every job,
                        crew, and customer touchpoint.
                    </p>
                </div>

                {/* Call-to-actions */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Button
                        className="px-8 shadow-lg shadow-primary/30"
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

                {/* Visual placeholder */}
                <Card className="mx-auto mt-12 w-full max-w-5xl border border-default-200/60 bg-default-50/80 backdrop-blur-md dark:border-default-200/30 dark:bg-default-50/10" radius="lg">
                    <div className="flex aspect-video w-full items-center justify-center text-base font-medium text-default-500">
                        Dashboard Mockup Placeholder
                    </div>
                </Card>
            </div>
        </section>
    )
}

