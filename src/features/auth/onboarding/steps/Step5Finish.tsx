"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

export default function Step5Finish({ onBack }: { onBack: () => void }) {
    const navigate = useNavigate();

    useEffect(() => {
        // 🎉 Confetti burst
        const duration = 2000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 360, ticks: 90, zIndex: 9999 };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: Math.random(), y: Math.random() - 0.2 },
                colors: ["#fbbf24", "#f59e0b", "#ef4444", "#3b82f6", "#10b981"],
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="flex flex-col items-center justify-center gap-8 px-6 max-w-md mx-auto text-center"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Success Icon */}
            <div className="flex items-center justify-center">
                <CheckCircle2 className="w-20 h-20 text-primary drop-shadow-[0_0_20px_var(--tw-shadow-color)] shadow-primary" />
            </div>

            {/* Header */}
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
                You’re all set!
            </h2>

            <p className="text-default-700 dark:text-default-400 text-base leading-relaxed max-w-sm">
                BossOS is ready to help you run your business smarter and faster.
                <br />
                You can always tweak your setup later in Settings.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
                <Button
                    variant="light"
                    onPress={onBack}
                    className="font-semibold text-default-600 hover:text-primary transition-colors"
                >
                    Back
                </Button>

                <Button
                    color="primary"
                    radius="full"
                    size="lg"
                    onPress={() => navigate("/dashboard")}
                    className="min-w-[180px] font-semibold text-base hover:scale-[1.03] active:scale-[0.97] transition-all"
                >
                    Go to Dashboard
                </Button>
            </div>
        </motion.div>
    );
}
