"use client";
import { useState } from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { motion } from "framer-motion";

export default function Step2Business({
    onNext,
    onBack,
}: {
    onNext: () => void;
    onBack: () => void;
}) {
    const [businessName, setBusinessName] = useState("");
    const [tradeType, setTradeType] = useState<string>("");

    const trades = [
        { key: "hvac", label: "HVAC" },
        { key: "sprayfoam", label: "Spray Foam" },
        { key: "plumbing", label: "Plumbing" },
        { key: "electrical", label: "Electrical" },
        { key: "general", label: "General Contracting" },
        { key: "other", label: "Other" },
    ];

    return (
        <motion.div
            className="flex flex-col gap-8 px-6 max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Header */}
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Tell us about your business
            </h2>

            <p className="text-default-700 dark:text-default-800 text-sm leading-relaxed">
                Just a few quick details so we can personalize your BossOS setup.
            </p>

            {/* Form */}
            <div className="flex flex-col gap-6 text-left">
                <Input
                    label="Business Name"
                    placeholder="e.g. Urban Mechanical"
                    variant="bordered"
                    size="lg"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                />

                <Select
                    label="Trade Type"
                    placeholder="Select your trade"
                    variant="bordered"
                    size="lg"
                    selectedKeys={tradeType ? [tradeType] : []}
                    onChange={(e) => setTradeType(e.target.value)}
                >
                    {trades.map((trade) => (
                        <SelectItem key={trade.key}>{trade.label}</SelectItem>
                    ))}
                </Select>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
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
                    className="min-w-[160px] font-semibold text-base hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
                    onPress={onNext}
                    isDisabled={!businessName || !tradeType}
                >
                    Continue
                </Button>
            </div>
        </motion.div>
    );
}
