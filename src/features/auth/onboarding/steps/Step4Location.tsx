"use client";
import { useState } from "react";
import { Input, Button, Select, SelectItem } from "@heroui/react";
import { motion } from "framer-motion";

export default function Step4Location({
    onNext,
    onBack,
}: {
    onNext: () => void;
    onBack: () => void;
}) {
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [serviceRadius, setServiceRadius] = useState("25");

    const isValid = city.trim().length > 1 && state.trim().length === 2;

    return (
        <motion.div
            className="flex flex-col gap-8 px-6 max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Header */}
            <h2 className="text-3xl font-semibold text-foreground">
                Where do you operate?
            </h2>

            <p className="text-default-700 dark:text-default-400">
                Tell us your base city and how far you typically travel for work.
            </p>

            {/* Form */}
            <div className="flex flex-col gap-6 text-left">
                <Input
                    label="City"
                    placeholder="e.g. Texarkana"
                    variant="bordered"
                    size="lg"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                <Input
                    label="State (2-letter code)"
                    placeholder="e.g. TX"
                    variant="bordered"
                    size="lg"
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                />

                <Select
                    label="Service Radius (miles)"
                    placeholder="Select radius"
                    variant="bordered"
                    size="lg"
                    selectedKeys={[serviceRadius]}
                    onChange={(e) => setServiceRadius(e.target.value)}
                >
                    <SelectItem key="10">10 miles</SelectItem>
                    <SelectItem key="25">25 miles</SelectItem>
                    <SelectItem key="50">50 miles</SelectItem>
                    <SelectItem key="75">75 miles</SelectItem>
                    <SelectItem key="100">100 miles</SelectItem>
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
                    className="min-w-[160px] font-semibold text-base hover:scale-[1.03] active:scale-[0.97] transition-all"
                    onPress={onNext}
                    isDisabled={!isValid}
                >
                    Continue
                </Button>
            </div>
        </motion.div>
    );
}
