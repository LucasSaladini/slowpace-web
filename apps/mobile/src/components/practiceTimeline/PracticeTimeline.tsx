import { Sparkles } from "lucide-react";

export function PracticeTimeline({ sessions }: { sessions: any[] }) {
    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-[var(--border)]">
            {sessions.map((session) => (
                <div className="relative pl-12" key={session.id}>
                    <div
                        className="absolute left-0 mt-1.5 w-10 h-10 rounded-full border-4 flex items-center justify-center"
                        style={{ backgroundColor: session.hobby.color, borderColor: 'var(--bg-app)' }}
                    >
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <header className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-tighter" style={{ color: 'var(--text-main)' }}>
                                {session.hobby.name}
                            </span>
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                {new Date(session.createdAt).toLocaleDateString('pt-BR')} • {session.duration} min
                            </span>
                        </header>
                        {session.content && (
                            <p className="text-sm italic font-light leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                &ldquo;{session.content}&rdquo;
                            </p>
                        )}
                        <div className="mt-2 text-[10px] text-emerald-500/70 flex items-center gap-1">
                            <Sparkles size={10} />
                            Reflexão do dia concluída
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}