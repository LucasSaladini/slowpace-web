'use client'

import { useEffect, useState, useCallback } from 'react'
import { hobbyService, DashboardStats, StardustHobby } from '../services/hobby-service'
import { StatsSummary } from '@/components/dashboard/stats-summary'
import { CreateHobbyForm } from '@/components/dashboard/create-hobby-form'
import { Loader2, Trash2, PlusCircle, Settings2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingHobby, setEditingHobby] = useState<StardustHobby | null>(null);

  const loadData = useCallback(async () => {
    try {
      const data = await hobbyService.getStats()
      setStats(data)
    } catch (error) {
      toast.error(`Erro ao sincronizar dados. ${error}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddSession = async (hobbyId: string, minutes: number) => {
    try {
      await hobbyService.addSession(hobbyId, minutes)
      toast.success(`+${minutes} min registrados!`)
      loadData()
    } catch (err) {
      toast.error(`Erro ao registrar tempo. ${err}`)
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
      <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8 pb-24">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="flex justify-between items-center">
            <h1 className="text-xl font-light tracking-widest text-zinc-400 uppercase">
              SlowPace / <span className="text-zinc-100">Cultivo</span>
            </h1>
          </header>
          <section className="space-y-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">Sua Constelação</h2>
              <StatsSummary totalMinutes={stats?.totalMinutes || 0} />
            </div>
            <div className="relative h-80 w-full bg-zinc-900/10 rounded-[2.5rem] border border-zinc-800/40 flex items-center justify-center overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent opacity-50" />
              {stats?.stardustData.length === 0 ? (
                <p className="text-zinc-600 italic font-light">Seu céu ainda não possui estrelas...</p>
              ) : (
                <div className="flex gap-16 p-8 flex-wrap justify-center items-center relative z-10">
                  {stats?.stardustData.map((hobby: StardustHobby, index: number) => {
                    const size = Math.max(60, Math.min(hobby.totalMinutes / 1.2, 200));
                    const blur = Math.max(20, Math.min(hobby.totalMinutes / 10, 60));
                    const opacity = Math.max(0.2, Math.min(0.1 + (hobby.totalMinutes / 2000), 0.5));
                    return (
                      <div 
                        key={hobby.id} 
                        className="relative flex flex-col items-center group transition-transform duration-700 hover:scale-110"
                        style={{ 
                          animation: `float ${3 + (index % 3)}s ease-in-out infinite` 
                        }}
                      >
                        <div 
                          className="rounded-full animate-pulse transition-all duration-1000"
                          style={{ 
                            backgroundColor: hobby.color, 
                            width: `${size}px`, 
                            height: `${size}px`,
                            filter: `blur(${blur}px)`,
                            opacity: opacity
                          }}
                        />
                        <div className="absolute -bottom-8 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                          <span className="text-[10px] tracking-widest uppercase font-bold text-zinc-400 whitespace-nowrap">
                            {hobby.name}
                          </span>
                          <span className="text-[9px] text-zinc-600">
                            {Math.floor(hobby.totalMinutes / 60)}h acumuladas
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
          <section className="grid gap-6">
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
              {stats?.stardustData.map((hobby: StardustHobby) => (
                <div 
                  key={hobby.id} 
                  className="group p-5 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl flex items-center justify-between hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: hobby.color }} />
                    <div>
                      <h3 className="text-zinc-200 font-medium">{hobby.name}</h3>
                      <p className="text-xs text-zinc-500 font-light">
                        {Math.floor(hobby.totalMinutes / 60)}h {hobby.totalMinutes % 60}m acumulados
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger>
                        <button 
                          onClick={() => handleAddSession(hobby.id, 30)}
                          className="p-2 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                        >
                          <PlusCircle size={18} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-zinc-800 text-zinc-100 border-zinc-700">
                        <p>Cultivar +30 min</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <button 
                          onClick={() => setEditingHobby(hobby)}
                          className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Settings2 size={16} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-zinc-800 text-zinc-100 border-zinc-700">
                        <p>Ajustar aura</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger >
                        <button 
                          onClick={() => handleDeleteHobby(hobby.id)}
                          className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-rose-950 text-rose-200 border-rose-900">
                        <p>Remover luz</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </TooltipProvider>
  )
}