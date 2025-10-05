"use client";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { VERTICALS } from "@/config/verticals";
import Dashboard from "../dashboard/Dashboard";

// src/features/landing/Hero.tsx
export default function Hero() {
  return (



      <section className="relative isolate bg-background text-foreground">
          <div className="fixed inset-0 w-screen h-screen z-0 ">
              <BackgroundRippleEffect />
          </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pt-24 pb-20 sm:pt-32 lg:px-8">
        <header className="flex flex-col items-center gap-6 text-center">
          <div className="relative inline-flex items-center z-1">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="bg-content1 text-4xl text-foreground font-semibold flex items-center space-x-2"
            >
              <span>Boss.OS</span>
            </HoverBorderGradient>
          </div>


          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl z-1">
            The ultimate tool for your home service business.
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-default-900 z-1">
            One platform to run any service business, with trade packs for:
            <p></p><LayoutTextFlip text=" " words={[...VERTICALS]} />
          </p>
          <p className="max-w-3xl text-lg leading-8 text-default-900 z-1">
            Multi-location ready. Mobile-first for techs. Owner-grade analytics out of the box.
          </p>

        </header>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button className="inline-flex items-center justify-center gap-2 rounded-large bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-medium transition-colors duration-200 hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus z-1">
            Get Started Free
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-large border border-default-200 bg-content1 px-6 py-3 text-base font-semibold text-foreground shadow-small transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus dark:border-default-100/40 z-1">
            See BossOS in Action
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-default-200 bg-content1/80 p-2 shadow-large backdrop-blur dark:border-default-100/40">
          <Dashboard />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-default-800">
            Trusted by fast-moving field teams replacing legacy stacks.
          </p>
        </div>
      </div>
    </section>
  );
}
