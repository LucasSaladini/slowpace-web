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
        <div className="p-6 g-zinc-900/90 order border-zinc-800 rounded-[2rem] backdrop-blue-xl fade-in zoom-in-95">
            <header className="mb-6">
                <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">Registrar Prática</h3>
                <p className="text-zinc-200 text-lg font-light">{hobbyName}</p> 
            </header>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest">
                        <Clock size={12} />
                    </label>
                    <input type="number" 
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-zinc-700 outline-none transition-all"
                    />
                </div>
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest">
                        <MessagesSquare size={12} /> Como foi sua prática? (opcional)
                    </label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Um breve relato sobre seu momento..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm min-h-[100px] focus:ring-1 focus:ring-zinc-700 outline-none resize-none transition-all" 
                    />
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={onCancel} className="flex-1 py-3 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                        Cancelar
                    </button>
                    <button type="submit" disabled={isSubmitting || duration <= 0} className="flex-[2] bg-zinc-100 text-zinc-950 py-3 rounded-xl text-xs font-bold hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        Confirmar Cultivo
                    </button>
                </div>
            </form>
        </div>
    )
}