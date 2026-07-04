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
import { OnboardingTour } from '@/components/onboarding/OnboardingTour'
import { FinanceContainer } from '@/components/finance/finance-container'
import { MoodSelector } from '@/components/mood/MoodSelector'
import { AnimatePresence, motion } from 'framer-motion'
import { useMoodStore } from '@/store/useMoodStore'

interface ActionIconProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant: 'emerald' | 'blue' | 'rose' | 'zinc';
  hideUntilHover?: boolean;
}

function ActionIcon({ onClick, icon, label, variant, hideUntilHover }: ActionIconProps) {
  const variants = {
    emerald: "text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10",
    blue: "text-blue-500 hover:text-blue-400 hover:bg-blue-500/10",
    rose: "text-rose-500 hover:text-rose-400 hover:bg-rose-500/10",
    zinc: "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800",
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          role="button"
          tabIndex={0}
          aria-label={label}
          className={`
            p-2 rounded-lg transition-all cursor-pointer 
            flex items-center justify-center flex-shrink-0
            ${variants[variant]} 
            ${hideUntilHover
              ? "opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus:opacity-100"
              : "opacity-100"
            }
          `}
        >
          <span className="flex items-center justify-center w-5 h-5 min-w-[20px] min-h-[20px] flex-shrink-0">
            {icon}
          </span>
        </span>
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
  const [showTour, setShowTour] = useState(false);
  const { currentMood } = useMoodStore()

  const loadData = useCallback(async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        hobbyService.getStats(),
        hobbyService.getHistory()
      ])

      if (statsData && statsData.hasSeenTour === false) {
        setShowTour(true);
      }
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
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-app)]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-700" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      {showTour && <OnboardingTour onComplete={() => setShowTour(false)} />}
      <div className="min-h-screen relative transition-colors duration-700 ease-in-out"
        style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-main)' }}>
        <Header />
        <MoodSelector isPaused={isPaused} onTogglePause={handleTogglePause} />
        <main className={`
        min-h-screen p-4 md:p-8 pb-24 transition-all duration-1000 ease-in-out
        ${isPaused ? "blur-xl sepia-[0.3] grayscale-[0.2] select-none" : "blur-0"}
      `}>
          <div className={`max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 ${isPaused ? "pointer-events-none" : ""}`}>
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {currentMood === 'presence' && (
                  <motion.div
                    key="presence"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-12"
                  >
                    <header>
                      <h1 className="text-xl font-light tracking-widest uppercase">
                        SlowPace / <span style={{ opacity: 0.6 }}>Cultivo</span>
                      </h1>
                    </header>
                    <section className="space-y-6">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--text-muted)' }}>Sua Constelação</h2>
                        <StatsSummary totalMinutes={stats?.totalMinutes || 0} />
                      </div>
                      <div className="relative h-80 w-full rounded-[2.5rem] border transition-colors duration-700 flex items-center justify-center overflow-hidden backdrop-blur-sm"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-500/10 via-transparent to-transparent opacity-30" />
                        {stats?.stardustData.length === 0 ? (
                          <p className="opacity-40 italic font-light">Seu céu ainda não possui estrelas...</p>
                        ) : (
                          <div className="flex gap-12 p-8 flex-wrap justify-center items-center relative z-10">
                            {stats?.stardustData.map((hobby, index) => {
                              const size = Math.max(60, Math.min(hobby.totalMinutes / 1.2, 200));
                              const blur = Math.max(20, Math.min(hobby.totalMinutes / 10, 60));
                              const opacity = Math.max(0.2, Math.min(0.1 + (hobby.totalMinutes / 2000), 0.5));
                              return (
                                <div key={hobby.id} className="relative flex flex-col items-center group transition-transform duration-700 hover:scale-110"
                                  style={{ animation: `float ${3 + (index % 3)}s ease-in-out infinite` }}>
                                  <div className="rounded-full animate-pulse transition-all duration-1000"
                                    style={{ backgroundColor: hobby.color, width: `${size}px`, height: `${size}px`, filter: `blur(${blur}px)`, opacity: opacity }} />
                                  <div className="absolute -bottom-8 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <span className="text-[10px] tracking-widest uppercase font-bold whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{hobby.name}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </section>
                    <section className="space-y-6">
                      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                        <h2 className="text-sm font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>Seus Hábitos</h2>
                      </div>
                      <CreateHobbyForm
                        onSuccess={loadData}
                        editingHobby={editingHobby}
                        onCancel={() => setEditingHobby(null)}
                        currentCount={stats?.stardustData.length || 0}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stats?.stardustData.map((hobby) => (
                          <div key={hobby.id} className="group p-5 border rounded-2xl flex items-center justify-between transition-all"
                            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                            <div className="flex items-center gap-4">
                              <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: hobby.color }} />
                              <div>
                                <h3 className="font-medium text-sm" style={{ color: 'var(--text-main)' }}>{hobby.name}</h3>
                                <p className="text-[10px] font-light" style={{ color: 'var(--text-muted)' }}>
                                  {Math.floor(hobby.totalMinutes / 60)}h {hobby.totalMinutes % 60}m acumulados
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-1">
                              <ActionIcon onClick={() => setLoggingHobby(hobby)} icon={<PlusCircle size={18} />} label="Registrar Prática" variant="emerald" />
                              <ActionIcon onClick={() => setEditingHobby(hobby)} icon={<Settings2 size={16} />} label="Ajustar aura" variant="blue" hideUntilHover />
                              <ActionIcon onClick={() => handleDeleteHobby(hobby.id)} icon={<Trash2 size={16} />} label="Remover luz" variant="rose" hideUntilHover />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </motion.div>
                )}
                {currentMood === 'focus' && (
                  <motion.div
                    key="focus"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-12"
                  >
                    <header>
                      <h1 className="text-xl font-light tracking-widest uppercase">
                        SlowPace / <span style={{ opacity: 0.6 }}>Foco Essencial</span>
                      </h1>
                    </header>
                    <section className="space-y-6">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--text-muted)' }}>Menos é Mais</h2>
                        <p className="text-sm opacity-60 font-light">Selecione até 5 tarefas primordiais para direcionar sua energia hoje.</p>
                      </div>
                    </section>
                  </motion.div>
                )}
                {currentMood === 'flow' && (
                  <motion.div
                    key="flow"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="space-y-12"
                  >
                    <header>
                      <h1 className="text-xl font-light tracking-widest uppercase">
                        SlowPace / <span style={{ opacity: 0.6 }}>Fluxo</span>
                      </h1>
                    </header>
                    <section className="space-y-6">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--text-muted)' }}>Finanças Conscientes</h2>
                      </div>
                      <FinanceContainer />
                    </section>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
            <aside
              className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l pt-8 lg:pt-0 lg:pl-8 transition-colors duration-700"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="sticky top-8 space-y-8">
                <header className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--text-muted)' }}>Diário de Cultivo</h2>
                </header>
                <PracticeTimeline sessions={history} />
              </div>
            </aside>
          </div>
        </main>
        {
          loggingHobby && (
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
          )
        }
        {
          isPaused && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-auto">
              <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" />
              <div className="relative backdrop-blur-2xl p-10 rounded-[3rem] border text-center space-y-4 shadow-2xl mx-4 transition-colors duration-700"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <p className="text-[10px] font-bold tracking-[0.4em] text-amber-500/80 uppercase">Modo Pausa Ativo</p>
                <h2 className="text-xl font-extralight tracking-tight italic" style={{ color: 'var(--text-main)' }}>
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
          )
        }
        <div className="hidden min-[820px]:block fixed bottom-10 right-10 z-[100]">
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
      </div >
    </TooltipProvider >
  )
}