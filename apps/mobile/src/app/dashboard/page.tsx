'use client'

import { useEffect, useState, useCallback } from 'react'
import { hobbyService, DashboardStats, StardustHobby, Session } from '../services/hobby-service'
import { StatsSummary } from '@/components/dashboard/stats-summary'
import { CreateHobbyForm } from '@/components/dashboard/create-hobby-form'
import { Loader2, Trash2, PlusCircle, Settings2, Coffee } from 'lucide-react'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LogSessionForm } from '@/components/logSession/LogSessionForm'
import { PracticeTimeline } from '@/components/practiceTimeline/PracticeTimeline'
import { Header } from '@/components/header/Header'

interface ActionIconProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant: 'emerald' | 'blue' | 'rose' | 'zinc';
  hideUntilHover?: boolean;
}

function ActionIcon({ onClick, icon, label, variant, hideUntilHover }: ActionIconProps) {
  const variants = {
    emerald: "hover:text-emerald-400 hover:bg-emerald-500/10",
    blue: "hover:text-blue-400 hover:bg-blue-500/10",
    rose: "hover:text-rose-400 hover:bg-rose-500/10",
    zinc: "hover:text-zinc-300 hover:bg-zinc-800",
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          onClick={onClick}
          type="button"
          aria-label={label}
          className={`
            p-2 text-zinc-500 rounded-lg transition-all cursor-pointer 
            flex items-center justify-center flex-shrink-0
            ${variants[variant]} 
            ${hideUntilHover ? "opacity-0 group-hover:opacity-100 focus:opacity-100" : "opacity-100"}
          `}
        >
          <span className="flex items-center justify-center w-5 h-5 min-w-[20px] min-h-[20px] flex-shrink-0">
            {icon}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="top" 
        className={variant === 'rose' 
          ? "bg-rose-950 text-rose-200 border-rose-900" 
          : "bg-zinc-800 text-zinc-100 border-zinc-700"}
      >
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingHobby, setEditingHobby] = useState<StardustHobby | null>(null);
  const [loggingHobby, setLoggingHobby] = useState<StardustHobby | null>(null);
  const [history, setHistory] = useState<Session[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        hobbyService.getStats(),
        hobbyService.getHistory()
      ])
      setStats(statsData)
      setHistory(historyData)

      if (statsData && typeof statsData.isPaused === 'boolean') {
        setIsPaused(statsData.isPaused);
      }
    } catch (error) {
      toast.error(`Erro ao sincronizar dados. ${error}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleTogglePause = async () => {
    try {
      const result = await hobbyService.togglePause();
      setIsPaused(result.isPaused);
      
      if (result.isPaused) {
        toast.success("Modo pausa ativado. Aproveite seu descanso.", {
          icon: <Coffee className="h-4 w-4" />,
        });
      } else {
        toast.success("Bem-vindo de volta ao seu cultivo.");
      }
      
      loadData();
    } catch (err) {
      toast.error("Não foi possível alterar o estado de pausa.");
    }
  }

  const handleDeleteHobby = async (id: string) => {
    if (!confirm("Deseja remover este hobby? O tempo acumulado será perdido.")) return
    try {
      await hobbyService.delete(id)
      toast.success("Hobby removido")
      loadData()
    } catch (err) {
      toast.error(`Erro ao deletar. ${err}`)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-700" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-zinc-950 relative">
        <Header />
        <main className={`
          min-h-screen bg-zinc-800 text-zinc-100 p-4 md:p-8 pb-24 transition-all duration-1000 ease-in-out
          ${isPaused ? "blur-xl sepia-[0.3] grayscale-[0.2] pointer-events-none select-none" : "blur-0"}
        `}>
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="flex-1 space-y-12">
              <header>
                <h1 className="text-xl font-light tracking-widest text-zinc-400 uppercase">
                  SlowPace / <span className="text-zinc-100">Cultivo</span>
                </h1>
              </header>
              <section className="space-y-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">Sua Constelação</h2>
                  <StatsSummary totalMinutes={stats?.totalMinutes || 0} />
                </div>
                <div className="relative h-80 w-full bg-zinc-900/10 rounded-[2.5rem] border border-zinc-800/40 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent opacity-50" />
                  {stats?.stardustData.length === 0 ? (
                    <p className="text-zinc-600 italic font-light">Seu céu ainda não possui estrelas...</p>
                  ) : (
                    <div className="flex gap-12 p-8 flex-wrap justify-center items-center relative z-10">
                      {stats?.stardustData.map((hobby, index) => {
                        const size = Math.max(60, Math.min(hobby.totalMinutes / 1.2, 200));
                        const blur = Math.max(20, Math.min(hobby.totalMinutes / 10, 60));
                        const opacity = Math.max(0.2, Math.min(0.1 + (hobby.totalMinutes / 2000), 0.5));
                        return (
                          <div 
                            key={hobby.id} 
                            className="relative flex flex-col items-center group transition-transform duration-700 hover:scale-110"
                            style={{ animation: `float ${3 + (index % 3)}s ease-in-out infinite` }}
                          >
                            <div 
                              className="rounded-full animate-pulse transition-all duration-1000"
                              style={{ 
                                backgroundColor: hobby.color, width: `${size}px`, height: `${size}px`,
                                filter: `blur(${blur}px)`, opacity: opacity
                              }}
                            />
                            <div className="absolute -bottom-8 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                              <span className="text-[10px] tracking-widest uppercase font-bold text-zinc-400 whitespace-nowrap">{hobby.name}</span>
                              <span className="text-[9px] text-zinc-600">{Math.floor(hobby.totalMinutes / 60)}h acumuladas</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <h2 className="text-sm font-medium text-zinc-400 tracking-wider uppercase">Seus Hábitos</h2>
                </div>
                <CreateHobbyForm 
                  onSuccess={loadData} 
                  editingHobby={editingHobby} 
                  onCancel={() => setEditingHobby(null)}
                  currentCount={stats?.stardustData.length || 0} 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats?.stardustData.map((hobby) => (
                    <div key={hobby.id} className="group p-5 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl flex items-center justify-between hover:border-zinc-700 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: hobby.color }} />
                        <div>
                          <h3 className="text-zinc-200 font-medium text-sm">{hobby.name}</h3>
                          <p className="text-[10px] text-zinc-500 font-light">
                            {Math.floor(hobby.totalMinutes / 60)}h {hobby.totalMinutes % 60}m acumulados
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <ActionIcon 
                          onClick={() => setLoggingHobby(hobby)} 
                          icon={<PlusCircle size={18} />} 
                          label="Registrar Prática"
                          variant="emerald"
                        />
                        <ActionIcon 
                          onClick={() => setEditingHobby(hobby)} 
                          icon={<Settings2 size={16} />} 
                          label="Ajustar aura"
                          variant="blue"
                          hideUntilHover
                        />
                        <ActionIcon 
                          onClick={() => handleDeleteHobby(hobby.id)} 
                          icon={<Trash2 size={16} />} 
                          label="Remover luz"
                          variant="rose"
                          hideUntilHover
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-zinc-900/50 pt-8 lg:pt-0 lg:pl-8">
              <div className="sticky top-8 space-y-8">
                <header className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <h2 className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">Diário de Cultivo</h2>
                </header>
                <PracticeTimeline sessions={history} />
              </div>
            </aside>
          </div>
        </main>
        {loggingHobby && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md">
              <LogSessionForm
                hobbyId={loggingHobby.id}
                hobbyName={loggingHobby.name}
                onSuccess={loadData}
                onCancel={() => setLoggingHobby(null)}
              />
            </div>
          </div>
        )}
        {isPaused && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-auto"> 
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" />
            <div className="relative bg-zinc-900/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-zinc-800/50 text-center space-y-4 shadow-2xl mx-4">
              <p className="text-[10px] font-bold tracking-[0.4em] text-amber-500/80 uppercase">Modo Pausa Ativo</p>
              <h2 className="text-zinc-100 text-xl font-extralight tracking-tight italic">
                &quot;A pausa é parte da música.&quot;
              </h2>
              <button 
                onClick={handleTogglePause}
                className="mt-4 px-8 py-2 bg-zinc-100 text-zinc-900 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-all duration-300 shadow-lg cursor-pointer"
              >
                Retomar Cultivo
              </button>
            </div>
          </div>
        )}
        <div className="fixed bottom-10 right-10 z-[100]">
          <Tooltip>
            <TooltipTrigger>
              <button
                onClick={handleTogglePause}
                className={`
                  group flex items-center gap-3 p-4 rounded-full shadow-2xl transition-all duration-500 cursor-pointer
                  ${isPaused 
                    ? "bg-amber-500 text-zinc-950 scale-110 rotate-12" 
                    : "bg-zinc-900 text-zinc-100 hover:bg-zinc-800 border border-zinc-800"}
                `}
              >
                <Coffee size={24} className={isPaused ? "animate-pulse" : ""} />
                
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
                  {isPaused ? "Retomar" : "Modo Pausa"}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="left" 
              className={isPaused ? "bg-amber-500 text-zinc-950 border-none" : "bg-zinc-800 text-zinc-100 border-zinc-700"}
            >
              <p>{isPaused ? "Retomar Cultivo" : "Pausar para descansar"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}