"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createFocusSchema } from "@/lib/focus-schema";
import { toast } from "sonner";
import { ZodError } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface CreateFocusFormProps {
    onAddTask: (title: string) => Promise<void>;
    activeCount: number;
}

export function CreateFocusForm({ onAddTask, activeCount }: CreateFocusFormProps) {
    const [title, setTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isLimitReached = activeCount >= 5;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);

            const validated = createFocusSchema.parse({ title });

            await onAddTask(validated.title);
            setTitle("");
        } catch (error) {
            if (error instanceof ZodError) {
                const firstIssue = error.issues[0];
                toast.error(firstIssue?.message || "Erro de validação");
            } else {
                toast.error("Erro ao adicionar foco.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-1.5 rounded-xl border transition-colors duration-700 group"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
            <Input
                type="text"
                placeholder={isLimitReached ? "Carga cheia. Adicionar ao backlog mental?" : "O que merece sua energia hoje?"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:opacity-30 disabled:opacity-50"
                style={{ color: 'var(--text-main)' }}
            />
            <Button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="p-2 rounded-lg transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                style={{ backgroundColor: 'var(--border)', color: 'var(--text-main)' }}
                title="Fixar intenção de foco"
            >
                {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Plus size={16} />
                )}
            </Button>
        </form>
    )
}