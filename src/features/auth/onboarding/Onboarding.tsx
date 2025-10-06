"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingLayout from "@/app/layouts/OnboardingLayout";
import { SparklesCore } from "@/components/ui/sparkles";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

import Step1Welcome from "./steps/Step1Welcome";
import Step2Business from "./steps/Step2Business";
import Step3OwnerInfo from "./steps/Step3OwnerInfo";
import Step4Location from "./steps/Step4Location";
import Step5Finish from "./steps/Step5Finish";

// tiny hook: read current theme from <html class="dark"> without adding deps
function useIsDark(): boolean | null {
  const [isDark, setIsDark] = useState<boolean | null>(null);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const isDark = useIsDark();

  return (
    <OnboardingLayout>
      {/* Scope effects to this page, like Hero.tsx */}
      <section className="relative isolate min-h-screen flex items-center justify-center p-6">
        <div className="fixed inset-0 w-screen h-screen z-0 ">
              <BackgroundRippleEffect />
          </div>
        {/* Background effects (behind everything on this page only) */}
        <div className="pointer-events-none absolute inset-0 -z-20">

          {isDark !== null && (
            <SparklesCore
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={140}
              particleColor={isDark ? "#ffffff" : "#000000"}
              className="h-full w-full"
            />
          )}
        </div>

        {/* Optional gradient overlay to smooth bottom (same idea as Hero) */}
        <div
          className="pointer-events-none absolute inset-0 -z-10
          bg-[linear-gradient(to_bottom,transparent,white)]
          dark:bg-[linear-gradient(to_bottom,transparent,oklch(0.145_0_0))]
          blur-[0.5px]"
        />

        {/* Card/content */}
        <div className="relative z-10 w-full max-w-lg text-center space-y-6 backdrop-blur-sm bg-background/50 p-8 rounded-3xl border border-default-200 shadow-lg">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Step1Welcome onNext={next} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Step2Business onNext={next} onBack={back} />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Step3OwnerInfo onNext={next} onBack={back} />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Step4Location onNext={next} onBack={back} />
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Step5Finish onBack={back} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </OnboardingLayout>
  );
}
