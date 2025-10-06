"use client";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";

export default function Step1Welcome({ onNext }: { onNext: () => void }) {
    return (
        <motion.div
            className="flex flex-col items-center text-center gap-8 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Header */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Welcome to <span className="text-primary">BossOS</span>
            </h1>

            {/* Subtext */}
            <p className="max-w-md text-default-800 dark:text-default-800 leading-relaxed">
                Let’s get your business up and running — no tech skills required.
                This quick setup will walk you through everything step by step.
            </p>

            {/* Illustration (optional, can add later) */}
            {/* <img src="/assets/onboarding/welcome.svg" alt="Welcome" className="w-64 opacity-90" /> */}

            {/* CTA */}
            <Button
                color="primary"
                radius="full"
                size="lg"
                className="min-w-[200px] text-base font-semibold hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                onPress={onNext}
            >
                Start Setup
            </Button>

            {/* Sub-note */}
            <p className="text-xs text-default-700 dark:text-default-700">
                Takes less than 5 minutes.
            </p>
        </motion.div>
    );
}
