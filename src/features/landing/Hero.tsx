import SparklesPreview from "@/components/sparkles-demo";

// src/features/landing/Hero.tsx
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-primary-500/10 via-background to-background dark:from-primary-400/10 dark:via-background dark:to-background" />
      <div className="absolute -left-40 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10" />

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pt-24 pb-20 sm:pt-32 lg:px-8">
        <header className="flex flex-col items-center gap-6 text-center">
          <div className="relative inline-flex items-center">
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/60 via-secondary/40 to-primary/60 blur-sm" aria-hidden />
            <span className="relative inline-flex items-center gap-3 rounded-full border border-primary/30 bg-content1/95 px-6 py-2 shadow-[0_18px_45px_-20px_rgba(0,111,238,0.55)] backdrop-blur">
              
              <span className="flex flex-col text-left">
                <span className="text-sm font-semibold tracking-wide text-foreground">BossOS</span>
              </span>
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            The Operating System for Service Businesses
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-default-">
            Replace stitched-together tools with one sleek command center - scheduling, pricebooks, jobs, AR, and KPIs - built for HVAC, spray foam, and plumbing.
        </p>
        </header>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button className="inline-flex items-center justify-center gap-2 rounded-large bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-medium transition-colors duration-200 hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
            Get Started Free
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-large border border-default-200 bg-content1 px-6 py-3 text-base font-semibold text-foreground shadow-small transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus dark:border-default-100/40">
            See BossOS in Action
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-default-200 bg-content1/80 p-2 shadow-large backdrop-blur dark:border-default-100/40">
          <div className="aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-content2/70 via-content3/60 to-content1/80 ring-1 ring-inset ring-default-200/60 dark:from-content2/40 dark:via-content3/40 dark:to-content1/40 dark:ring-default-100/30" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-default-400">
            Trusted by fast-moving field teams replacing legacy stacks.
          </p>
        </div>
      </div>
    </section>
  );
}
