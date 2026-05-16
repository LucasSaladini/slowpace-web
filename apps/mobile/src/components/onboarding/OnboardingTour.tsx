'use client'

import { useState } from "react"
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Coffee, Target, ArrowRight } from "lucide-react"
import { hobbyService } from "@/app/services/hobby-service"

const STEPS = [
    {
        title: "Bem-vindo ao SlowPace",
        description: "Aqui, o tempo não é algo a ser vencido, mas um jardim a ser cultivado. Suas atividades tornam-se estrelas na sua constelação pessoal.",
        icon: <Sparkles className="text-amber-400" size={32} />
    },
    {
        title: "Cultive seus Hobbies",
        description: "Adicione o que te faz bem. Cada registro de tempo alimenta a luz de uma estrela. Sem pressão, apenas progresso real.",
        icon: <Target className="text-emerald-400" size={32} />
    },
    {
        title: "A arte da Pausa",
        description: "O botão de café não é apenas decorativo. Use-o para silenciar o ruído e lembrar que descansar também é produtivo.",
        icon: <Coffee className="text-blue-400" size={32} />
    }
]

export function OnboardingTour({ onComplete }: { onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);

    const hanldeNext = async () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            await hobbyService.completeTour();
            onComplete();
        }
    }

    const handleSkip = async () => {
        await hobbyService.completeTour();
        onComplete();
    }

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-zinc-950/80 backdrop-blur-xl p-5">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -20 }}
                    className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6 text-center"
                >
                    <div className="flex justify-center">{STEPS[currentStep].icon}</div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-light tracking-tight text-zinc-100 italic">
                            &quot;{STEPS[currentStep].title}&quot;
                        </h2>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            {STEPS[currentStep].description}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 pt-4">
                        <button onClick={hanldeNext} className="w-full py-3 bg-zinc-100 text-zinc-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-amber-400 flex items-center justify-center gap-2 group cursor-pointer">
                            {currentStep === STEPS.length -1 ? 'Iniciar Jornada' : 'Continuar'}
                            <ArrowRight size={14} className="group-hover:tranlate-x-1 transistion-transform" />
                        </button>
                        <button onClick={handleSkip} className="text-[9px] font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking=[0.3em] transition-colors cursor-pointer">
                            Pular Tour
                        </button>
                    </div>
                    <div className="flex justify-center gap-2 pt-2">
                        {STEPS.map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-4 bg-amber-500' : 'w-1 bg-zinc-800'}`} 
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}