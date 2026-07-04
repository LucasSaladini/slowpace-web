"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMoodStore, Mood } from "@/store/useMoodStore";
import React from "react";

interface MoodViewContainerProps {
    views: Record<Mood, React.ReactNode>;
}

export function MoodViewContainer({ views }: MoodViewContainerProps) {
    const currentMood = useMoodStore((state) => state.currentMood);

    return (
        <main className="relative min-h-screen pt-16 min-[820px]:pt-28 px-6 pb-24 min-[820px]:pb-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentMood}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-2xl mx-auto"
                >
                    {views[currentMood]}
                </motion.div>
            </AnimatePresence>
        </main>
    );
}