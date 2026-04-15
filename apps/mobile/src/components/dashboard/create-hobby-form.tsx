'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { hobbyService } from '@/app/services/hobby-service'
import { toast } from 'sonner'

interface CreateHobbyFormProps {
  onSuccess: () => void
}

export function CreateHobbyForm({ onSuccess }: CreateHobbyFormProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#fb7185')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await hobbyService.create({ name, color })
      toast.success("Hobby iniciado com sucesso", {
        description: "Agora é só cultivar no seu tempo.",
      })
      setName('')
      onSuccess()
    } catch (err) {
      toast.error("Não foi possível criar", {
        description: "Tente novamente em alguns instantes.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="Qual novo hábito quer cultivar?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-zinc-100 placeholder:text-zinc-600 text-sm"
        />
      </div>

      <div className="flex items-center gap-3 px-3 border-l border-zinc-800">
        <label className="text-xs text-zinc-500 uppercase tracking-widest">Cor:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-6 h-6 rounded-full overflow-hidden border-none bg-transparent cursor-pointer"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !name.trim()}
        className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-xl text-xs font-bold hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
        Adicionar
      </button>
    </form>
  )
}