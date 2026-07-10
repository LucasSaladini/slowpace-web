"use client";

import { useState } from "react";
import { FocusTask } from "@/app/services/focus-service";
import { CheckCircle2, Circle, Trash2, ArrowUpFromLine, ArrowDownToLine, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FocusTaskListProps {
    tasks: FocusTask[];
    onToggleComplete: (task: FocusTask) => Promise<void>;
    onMoveToActive: (task: FocusTask) => Promise<void>;
    onMoveToBacklog: (task: FocusTask) => Promise<void>; // 🌟 Nova ação
    onDelete: (id: string) => Promise<void>;
}

export function FocusTaskList({
    tasks,
    onToggleComplete,
    onMoveToActive,
    onMoveToBacklog,
    onDelete
}: FocusTaskListProps) {
    const [isBacklogOpen, setIsBacklogOpen] = useState(false);

    const activeTasks = tasks.filter(t => !t.isBacklog);
    const backlogTasks = tasks.filter(t => t.isBacklog);

    return (
        <div className="space-y-8 w-full">
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {activeTasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.3 }}
                            className="group flex items-center justify-between p-4 border rounded-xl transition-all duration-700 hover:shadow-sm"
                            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <button
                                    onClick={() => onToggleComplete(task)}
                                    className="cursor-pointer transition-transform active:scale-90"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    {task.isCompleted ? (
                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                    ) : (
                                        <Circle size={18} className="hover:text-[var(--text-main)] transition-colors" />
                                    )}
                                </button>
                                <span
                                    className={`text-sm font-light truncate transition-all duration-500 ${task.isCompleted ? 'line-through opacity-30 select-none' : ''
                                        }`}
                                    style={{ color: 'var(--text-main)' }}
                                >
                                    {task.title}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onMoveToBacklog(task)}
                                    className="p-1 text-zinc-500 hover:text-amber-500 transition-colors cursor-pointer"
                                    title="Adiar para o backlog mental"
                                >
                                    <ArrowDownToLine size={14} />
                                </button>
                                <button
                                    onClick={() => onDelete(task.id)}
                                    className="p-1 text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer"
                                    title="Remover em silêncio"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {activeTasks.length === 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        className="text-xs italic text-center py-8 font-light"
                    >
                        Nenhum foco definido para hoje. Seu dia está livre.
                    </motion.p>
                )}
            </div>
            {backlogTasks.length > 0 && (
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button
                        onClick={() => setIsBacklogOpen(!isBacklogOpen)}
                        className="flex items-center justify-between w-full text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <span>Backlog Mental ({backlogTasks.length})</span>
                        {isBacklogOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <AnimatePresence initial={false}>
                        {isBacklogOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden space-y-2 pt-4"
                            >
                                {backlogTasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex items-center justify-between p-3 border border-dashed rounded-xl opacity-60 hover:opacity-100 transition-all duration-300"
                                        style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border)' }}
                                    >
                                        <span className="text-xs font-light truncate max-w-[70%]" style={{ color: 'var(--text-main)' }}>
                                            {task.title}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onMoveToActive(task)}
                                                className="p-1 text-zinc-500 hover:text-emerald-500 transition-colors cursor-pointer"
                                                title="Trazer para o Foco Diário"
                                            >
                                                <ArrowUpFromLine size={13} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(task.id)}
                                                className="p-1 text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer"
                                                title="Remover permanentemente"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}