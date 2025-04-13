"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { Profile } from "@/db/schema";
import { motion } from "framer-motion";

export default function HomePage({ profile }: { profile?: Profile }) {
    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative flex flex-col gap-4 items-center justify-center px-4"
            >
                <div className="text-3xl md:text-7xl font-bold text-center text-primary">
                    Welcome to Crew Match
                </div>
                {profile ? (
                    <div className="font-light md:text-4xl py-4 text-secondary-foreground">
                        Hello, {profile.name}
                    </div>
                ) : (
                    <div className="font-light md:text-4xl py-4 text-secondary-foreground">
                        Sign in to get started
                    </div>
                )}
            </motion.div>
        </AuroraBackground>
    );
}
