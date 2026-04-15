'use client'

import { useEffect, useState, useCallback } from 'react'
import { hobbyService, DashboardStats, StardustHobby } from '../services/hobby-service'
import { StatsSummary } from '@/components/dashboard/stats-summary'
import { CreateHobbyForm } from '@/components/dashboard/create-hobby-form'
import { Loader2, Trash2, Clock, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const data = await hobbyService.getStats()
      setStats(data)
    } catch (error) {
      toast.error("Erro ao sincronizar dados")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddSession = async (hobbyId: string, minutes: number) => {
    try {
      console.log("Enviando sessão para:", hobbyId);
      await hobbyService.addSession(hobbyId, minutes)
      toast.success(`+${minutes} min registrados!`)
      loadData()
    } catch (err) {
      toast.error("Erro ao registrar tempo")
    }
  }

  const handleDeleteHobby = async (id: string) => {
    if (!confirm("Deseja remover este hobby? O tempo acumulado será perdido.")) return
    try {
      await hobbyService.delete(id)
      toast.success("Hobby removido")
      loadData()
    } catch (err) {
      toast.error("Erro ao deletar")
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
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex justify-between items-center">
          <h1 className="text-xl font-light tracking-widest text-zinc-400 uppercase">
            SlowPace / <span className="text-zinc-100">Cultivo</span>
          </h1>
        </header>
        <section className="space-y-8">
          <StatsSummary totalMinutes={stats?.totalMinutes || 0} />
          <div className="relative h-64 w-full bg-zinc-900/20 rounded-[2rem] border border-zinc-800/50 flex items-center justify-center overflow-hidden backdrop-blur-sm">
            {stats?.stardustData.length === 0 ? (
              <p className="text-zinc-600 italic font-light">Seu céu ainda não possui estrelas...</p>
            ) : (
              <div className="flex gap-12 p-8 flex-wrap justify-center items-center">
                {stats?.stardustData.map((hobby: StardustHobby) => (
                  <div key={hobby.id} className="relative flex flex-col items-center group">
                    <div 
                      className="rounded-full blur-[15px] opacity-30 animate-pulse transition-all duration-1000"
                      style={{ 
                        backgroundColor: hobby.color, 
                        width: `${Math.max(40, Math.min(hobby.totalMinutes / 1.5, 180))}px`, 
                        height: `${Math.max(40, Math.min(hobby.totalMinutes / 1.5, 180))}px` 
                      }}
                    />
                    <span className="absolute -bottom-6 text-[10px] tracking-widest uppercase text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {hobby.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        <section className="grid gap-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <h2 className="text-sm font-medium text-zinc-400 tracking-wider uppercase">Seus Hábitos</h2>
          </div>
          <CreateHobbyForm onSuccess={loadData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats?.stardustData.map((hobby: any) => (
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
                  <button 
                    onClick={() => handleAddSession(hobby.id, 30)}
                    className="p-2 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                    title="Adicionar 30 minutos"
                  >
                    <PlusCircle size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteHobby(hobby.id)}
                    className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}