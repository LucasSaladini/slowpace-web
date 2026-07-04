import { create } from "zustand";

export type Mood = 'presence' | 'focus' | 'flow'

interface MoodState {
    currentMood: Mood;
    setMood: (mood: Mood) => void;
}

export const useMoodStore = create<MoodState>((set) => ({
    currentMood: 'presence',
    setMood: (mood) => set(() => ({ currentMood: mood })),
}))