'use client'

import { useState } from "react"
import { hobbyService } from "@/app/services/hobby-service"
import { toast } from "sonner"
import { Clock, MessagesSquare, Sparkles, Loader2 } from "lucide-react"

interface LogSessionFormProps {
    hobbyId: string;
    hobbyName: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export function LogSessionForm({ hobbyId, hobbyName, onSuccess, onCancel }: LogSessionFormProps) {
    const [duration, setDuration] = useState<number>(30);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { message } = await hobbyService.addSession({
                hobbyId,
                duration,
                content: content.trim() || undefined
            });

            toast(hobbyName, {
                description: message,
                icon: <Sparkles className="text-amer-400" size={16} />,
                duration: 12000
            });

            onSuccess();
            onCancel();
        } catch (err) {
            toast.error('Não foi possível registrar seu tempo.')
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
    <div className="p-6 border rounded-[2rem] backdrop-blur-xl fade-in zoom-in-95 transition-colors duration-700"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <header className="mb-6">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>Registrar Prática</h3>
            <p className="text-lg font-light" style={{ color: 'var(--text-main)' }}>{hobbyName}</p> 
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    <Clock size={12} /> Duração (minutos)
                </label>
                <input type="number" 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-transparent border rounded-xl px-4 py-3 outline-none transition-all"
                    style={{ color: 'var(--text-main)', borderColor: 'var(--border)' }}
                />
            </div>
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    <MessagesSquare size={12} /> Como foi sua prática? (opcional)
                </label>
                <textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Um breve relato sobre seu momento..."
                    className="w-full bg-transparent border rounded-xl px-4 py-3 text-sm min-h-[100px] outline-none resize-none transition-all" 
                    style={{ color: 'var(--text-main)', borderColor: 'var(--border)' }}
                />
            </div>
            <div className="flex gap-3">
                <button type="button" onClick={onCancel} className="flex-1 py-3 text-xs font-medium hover:opacity-70 transition-colors cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting || duration <= 0} className={`flex-[2] py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer ${
                    'bg-zinc-100 text-zinc-950'
                }`}>
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    Confirmar Cultivo
                </button>
            </div>
        </form>
    </div>
    )
}