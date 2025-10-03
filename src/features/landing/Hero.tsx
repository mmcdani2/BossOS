// src/features/landing/Hero.tsx
import { Button, Card, Chip } from "@heroui/react";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background gradient tuned to brand palette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 
                   bg-gradient-to-b 
                   from-primary/20 via-background/60 to-background 
                   dark:from-primary/25 dark:via-background/40 dark:to-background"
      />

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-20 sm:pt-32 lg:px-8">
        {/* Eyebrow / Chip */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Chip
            className="mb-6 backdrop-blur-sm
                       border border-default/40 dark:border-secondary/50
                       bg-default/10 dark:bg-default/20
                       text-primary dark:text-secondary
                       shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
            radius="full"
            size="lg"
            variant="flat"
          >
            BossOS • Built for Field Ops at Scale
          </Chip>

          {/* Headline */}
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
            <span
              className="bg-gradient-to-r 
                         from-primary via-default to-secondary 
                         bg-clip-text text-transparent"
            >
              The Operating System for Service Businesses
            </span>
          </h1>

          {/* Subcopy */}
          <p className="mt-6 max-w-2xl text-lg text-default/80 dark:text-default/60">
            Replace stitched-together tools with one sleek command center —
            scheduling, pricebooks, jobs, AR, and KPIs — built for HVAC, spray
            foam, and plumbing.
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
            className="px-8 border-secondary text-secondary 
                       hover:bg-secondary hover:text-foreground transition-colors"
            radius="full"
            size="lg"
            variant="bordered"
          >
            See BossOS in Action
          </Button>
        </div>

        {/* Dashboard Preview */}
        <Card
          className="mx-auto mt-12 w-full max-w-5xl 
                     border border-default/60 
                     bg-background/70 backdrop-blur-lg
                     dark:border-default/30"
          radius="lg"
        >
          <div className="flex aspect-video w-full items-center justify-center text-base font-medium text-default/70">
            Dashboard Mockup Placeholder
          </div>
        </Card>

        {/* Micro trust strip */}
        <div className="mx-auto mt-8 max-w-5xl text-center">
          <p className="text-sm text-default/60">
            Trusted by fast-moving field teams replacing legacy stacks.
          </p>
        </div>
      </div>
    </section>
  );
}
