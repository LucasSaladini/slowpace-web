"use client";

import { motion } from "framer-motion";
import { Sparkles, Target, Waves, Coffee } from "lucide-react";
import { useMoodStore, Mood } from "@/store/useMoodStore";
import { cn } from "@/lib/utils";

const moods: { id: Mood; label: string; icon: any }[] = [
    { id: 'presence', label: 'Presença', icon: Sparkles },
    { id: 'focus', label: 'Foco', icon: Target },
    { id: 'flow', label: 'Fluxo', icon: Waves },
];

interface MoodSelectorProps {
    isPaused?: boolean;
    onTogglePause?: () => void;
}

export function MoodSelector({ isPaused = false, onTogglePause }: MoodSelectorProps) {
    const { currentMood, setMood } = useMoodStore();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 min-[820px]:bottom-auto min-[820px]:top-6 z-50 w-auto px-4 min-[820px]:px-0 flex items-center gap-2">
            <nav
                className="flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-md shadow-2xl transition-colors duration-700"
                style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border)' }}
            >
                {moods.map((mood) => {
                    const isActive = currentMood === mood.id && !isPaused;
                    const Icon = mood.icon;

                    return (
                        <button
                            key={mood.id}
                            disabled={isPaused}
                            onClick={() => setMood(mood.id)}
                            className={cn(
                                "relative flex items-center gap-2 px-3 py-2 min-[390px]:px-4 rounded-full transition-colors duration-500 cursor-pointer",
                                isPaused ? "opacity-30 cursor-not-allowed" : ""
                            )}
                            style={{
                                color: isActive ? 'var(--text-main)' : 'var(--text-muted)'
                            }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-mood-bg"
                                    className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.02)]"
                                    style={{ backgroundColor: 'var(--border)' }}
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                />
                            )}
                            <Icon size={16} className={cn("relative z-10", isActive && "animate-pulse")} />
                            <span className="relative z-10 text-xs font-medium tracking-wide">
                                {mood.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
            {onTogglePause && (
                <button
                    onClick={onTogglePause}
                    className={cn(
                        "min-[820px]:hidden flex items-center justify-center rounded-full shadow-2xl border transition-all duration-500 cursor-pointer h-[46px] w-[46px]",
                        isPaused
                            ? "bg-amber-500 text-zinc-950 border-amber-400 rotate-12 scale-105"
                            : ""
                    )}
                    style={{
                        backgroundColor: isPaused ? '' : 'var(--bg-header)',
                        borderColor: isPaused ? '' : 'var(--border)',
                        color: isPaused ? '' : 'var(--text-muted)'
                    }}
                >
                    <Coffee size={18} className={isPaused ? "animate-pulse" : ""} />
                </button>
            )}
        </div>
    );
}