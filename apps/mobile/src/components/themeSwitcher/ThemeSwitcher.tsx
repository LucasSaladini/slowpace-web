'use client'

import { useState, useEffect } from "react"
import { Sun, Moon, Coffee } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const THEMES = [
    { id: 'light', label: 'Claro', icon: Sun },
    { id: 'soft-dark', label: 'Suave', icon: Moon },
    { id: 'sepia', label: 'Sépia', icon: Coffee }
]

export function ThemeSwitcher() {
    const [state, setState] = useState({
        mounted: false,
        theme: 'soft-dark'
    })

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            const savedTheme = localStorage.getItem('slowpace.theme') || 'soft-dark'
            document.documentElement.setAttribute('data-theme', savedTheme)
            
            setState({
                mounted: true,
                theme: savedTheme
            })
        })

        return () => cancelAnimationFrame(frame)
    }, [])

    const applyTheme = (themeId: string) => {
        setState(prev => ({ ...prev, theme: themeId }))
        document.documentElement.setAttribute('data-theme', themeId)
        localStorage.setItem('slowpace.theme', themeId)
    }

    if(!state.mounted) return null

    return (
        <TooltipProvider>
            <div className="flex items-center gap-1 p-1 rounded-full border backdrop-blur-md transition-all duration-700"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                {THEMES.map((theme) => {
                const Icon = theme.icon
                const isActive = state.theme === theme.id

                return (
                    <Tooltip key={theme.id}>
                    <TooltipTrigger>
                        <button
                        onClick={() => applyTheme(theme.id)}
                        className={`
                            relative flex items-center justify-center p-2 rounded-full transition-all duration-500 cursor-pointer
                            ${isActive 
                            ? 'bg-zinc-100 text-zinc-900 shadow-lg scale-110' 
                            : 'hover:bg-zinc-800/20'}
                        `}
                        style={{ color: isActive ? '' : 'var(--text-muted)' }}
                        >
                        <Icon size={14} className={isActive ? 'animate-pulse' : ''} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent 
                        side="bottom" 
                        className="bg-zinc-800 border-zinc-700 text-[10px] font-bold uppercase tracking-widest text-zinc-200"
                    >
                        <p>{theme.label}</p>
                    </TooltipContent>
                    </Tooltip>
                )
                })}
            </div>
        </TooltipProvider>
    )
}