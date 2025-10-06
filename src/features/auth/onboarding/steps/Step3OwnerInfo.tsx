"use client";
import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { motion } from "framer-motion";

export default function Step3OwnerInfo({
    onNext,
    onBack,
}: {
    onNext: () => void;
    onBack: () => void;
}) {
    const [ownerName, setOwnerName] = useState("");
    const [ownerEmail, setOwnerEmail] = useState("");
    const [ownerPhone, setOwnerPhone] = useState("");

    const isValid =
        ownerName.trim().length > 1 &&
        ownerEmail.includes("@") &&
        ownerPhone.replace(/\D/g, "").length >= 10;

    return (
        <motion.div
            className="flex flex-col gap-8 px-6 max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <h2 className="text-3xl font-semibold text-foreground">
                Who’s the primary owner?
            </h2>

            <p className="text-default-700 dark:text-default-800">
                We’ll use this info for your account and billing setup later.
            </p>

            <div className="flex flex-col gap-6 text-left">
                <Input
                    label="Full Name"
                    placeholder="e.g. Alex Tennessen"
                    variant="bordered"
                    size="lg"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                />

                <Input
                    label="Email Address"
                    placeholder="you@company.com"
                    variant="bordered"
                    size="lg"
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                />

                <Input
                    label="Phone Number"
                    placeholder="(555) 123-4567"
                    variant="bordered"
                    size="lg"
                    type="tel"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                />
            </div>

            <div className="flex justify-between mt-6">
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
