"use client";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { VERTICALS } from "@/config/verticals";
import Dashboard from "../dashboard/Dashboard";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

// src/features/landing/Hero.tsx
export default function Hero() {
  return (



    <section className="relative isolate z-10 bg-background text-foreground">
          <div className="fixed inset-0 w-screen h-screen z-0 ">
              <BackgroundRippleEffect />
          </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pt-24 pb-20 sm:pt-32 lg:px-8">
        <header className="flex flex-col items-center gap-6 text-center">
          <div className="relative inline-flex items-center z-0">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="bg-content1 text-3xl text-foreground font-semibold flex items-center space-x-2"
            >
              <span>Boss.OS</span>
            </HoverBorderGradient>
          </div>


          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl z-1">
            The ultimate tool for your home service business.
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-default-900 z-1">
            One platform to run any service business, with trade packs for:
          </p>
          <div>
            <LayoutTextFlip text=" " words={[...VERTICALS]} />
          </div>
          <p className="max-w-3xl text-lg leading-8 text-default-900 z-1">
            Multi-location ready. Mobile-first for techs. Owner-grade analytics out of the box.
          </p>

        </header>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center z-20">
          <Button
            as={Link}
            to="/Onboarding"
            color="primary"
            radius="full"
            size="lg"
            className="min-w-[190px] font-semibold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started Free
          </Button>

          <Button
            color="default"
            radius="full"
            size="lg"
            className="
    min-w-[190px] font-semibold text-base tracking-wide transition-all duration-200
    bg-transparent text-foreground border border-default-700
    hover:bg-white hover:text-black hover:border-black
    dark:bg-default-100 dark:text-foreground dark:border-default-600
    dark:hover:bg-default-200 dark:hover:border-white dark:hover:text-white
    hover:scale-[1.02] active:scale-[0.98]
  "
          >
            See BossOS in Action
          </Button>
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
