'use client'

import { useState, useEffect } from 'react'
import { Plus, Loader2, Save, X, Calendar } from 'lucide-react'
import { hobbyService, StardustHobby } from '@/app/services/hobby-service'
import { toast } from 'sonner'

interface CreateHobbyFormProps {
  onSuccess: () => void
  editingHobby: StardustHobby | null
  onCancel: () => void
  currentCount: number
}

const QUIET_MORNING_PALETTE = [
  { name: 'Rose', color: '#fda4af' },
  { name: 'Mint', color: '#86efac' },
  { name: 'Sky', color: '#7dd3fc' },
  { name: 'Lavender', color: '#c4b5fd' },
  { name: 'Sand', color: '#fde68a' },
]

export function CreateHobbyForm({ onSuccess, editingHobby, onCancel, currentCount }: CreateHobbyFormProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(QUIET_MORNING_PALETTE[0].color)
  const [frequency, setFrequency] = useState('daily')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isLimitReached = !editingHobby && currentCount >= 5

  useEffect(() => {
    if (editingHobby) {
      setName(editingHobby.name)
      setColor(editingHobby.color)
      frequency: setFrequency(editingHobby.frequency)
    } else {
      setName('')
      setColor(QUIET_MORNING_PALETTE[0].color)
      setFrequency('daily')
    }
  }, [editingHobby])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      if (editingHobby) {
        await hobbyService.update(editingHobby.id, { name, color, frequency })
        toast.success("Hobby atualizado")
      } else {
        await hobbyService.create({ name, color, frequency })
        toast.success("Hobby iniciado com sucesso")
      }
      
      onSuccess()
      onCancel()
    } catch (err) {
      toast.error("Não foi possível salvar", {
        description: `${err}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`flex flex-col gap-4 p-5 border transition-all duration-500 ${
        editingHobby 
          ? 'bg-zinc-800/30 border-zinc-600 ring-1 ring-zinc-700' 
          : 'bg-zinc-900/50 border-zinc-800'
      } rounded-2xl ${isLimitReached ? 'opacity-60 grayscale' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            disabled={isLimitReached}
            placeholder={isLimitReached ? "Limite de 5 hobbies atingido" : "Qual novo hábito quer cultivar?"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-zinc-100 placeholder:text-zinc-600 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 px-3 border-l border-zinc-800">
          <Calendar size={14} className="text-zinc-500" />
          <select 
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            disabled={isLimitReached}
            className="bg-transparent border-none text-xs text-zinc-400 focus:ring-0 cursor-pointer"
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="occasional">Ocasional</option>
          </select>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {editingHobby && (
            <button type="button" onClick={onCancel} className="p-2 text-zinc-500 hover:text-zinc-300">
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || isLimitReached}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              editingHobby ? 'bg-emerald-500 text-emerald-950' : 'bg-zinc-100 text-zinc-950'
            } disabled:opacity-50`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : editingHobby ? <Save size={14} /> : <Plus size={14} />}
            {editingHobby ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </div>
      {!isLimitReached && (
        <div className="flex items-center gap-3 pt-2 border-t border-zinc-900">
          <span className="text-[9px] text-zinc-600 uppercase tracking-[0.2em]">Escolha a Aura</span>
          <div className="flex gap-2">
            {QUIET_MORNING_PALETTE.map((p) => (
              <button
                key={p.color}
                type="button"
                onClick={() => setColor(p.color)}
                className={`w-4 h-4 rounded-full transition-all ${color === p.color ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-125' : 'opacity-40 hover:opacity-100'}`}
                style={{ backgroundColor: p.color }}
              />
            ))}
          </div>
        </div>
      )}
    </form>
  )
}