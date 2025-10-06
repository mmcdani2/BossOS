"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/app/layouts/OnboardingLayout";
import Step1Welcome from "./steps/Step1Welcome";
import Step2Business from "./steps/Step2Business";
import Step3OwnerInfo from "./steps/Step3OwnerInfo";
import Step4Location from "./steps/Step4Location";
import Step5Finish from "./steps/Step5Finish";

export default function Onboarding() {
    const [step, setStep] = useState(1);

    const next = () => setStep((s) => Math.min(s + 1, 5));
    const back = () => setStep((s) => Math.max(s - 1, 1));
    const navigate = useNavigate();


    return (
        <OnboardingLayout>
            <div className="relative w-full max-w-lg text-center space-y-6 backdrop-blur-sm bg-background/50 p-8 rounded-3xl border border-default-200 shadow-lg z-10">
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
                            <Step5Finish
                                onBack={back}
                                />
                        </motion.div>
                    )}


                </AnimatePresence>
            </div>
        </OnboardingLayout>
    );
}
