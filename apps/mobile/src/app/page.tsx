'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authSchema, AuthData } from '@/app/lib/auth-schema'
import { authService } from '@/app/services/auth-service'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, ShieldCheck, Sparkles } from "lucide-react"
import { cn } from '@/lib/utils'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthData>({
    resolver: zodResolver(authSchema)
  })

  const onSubmit = async (data: AuthData) => {
    try {
      if (isLogin) {
        await authService.login(data)
      } else {
        await authService.signUp(data)
      }
      router.push('/dashboard')
    } catch (err: any) {
      toast.error("Houve um pequeno imprevisto", {
        description: err.response?.data?.message || "Não conseguimos conectar. Tente de novo, sem pressa.",
        duration: 5000,
        icon: <ShieldCheck size={20} />,
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 selection:bg-zinc-700">
      <Card className="w-full max-w-md border-zinc-800/50 bg-zinc-900/40 shadow-2xl backdrop-blur-md">
        <CardHeader className="space-y-3 pt-8">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-zinc-800/50 text-zinc-400">
              {isLogin ? <ShieldCheck size={32} /> : <Sparkles size={32} />}
            </div>
          </div>
          <CardTitle className="text-3xl font-medium tracking-tight text-center text-zinc-100">
            SlowPace
          </CardTitle>
          <CardDescription className="text-zinc-400 text-center text-base px-4 leading-relaxed">
            {isLogin
              ? "Um refúgio para o seu tempo. Entre quando se sentir pronto."
              : "Sem métricas, sem pressão. Apenas um espaço para o seu hobby."}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5 pt-4 px-8">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-400 ml-1">
                E-mail
              </label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="alex@exemplo.com"
                className="h-12 text-base bg-zinc-800/40 border-zinc-700/50 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-700 rounded-lg transition-all"
              />
              {errors.email && (
                <p className="text-xs text-red-400/90 ml-1 animate-in fade-in duration-300">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-400 ml-1">
                Senha
              </label>
              <Input
                {...register('password')}
                id="password"
                type="password"
                placeholder="Sua senha"
                className="h-12 text-base bg-zinc-800/40 border-zinc-700/50 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-700 rounded-lg transition-all"
              />
              {errors.password && (
                <p className="text-xs text-red-400/90 ml-1 animate-in fade-in duration-300">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-6 pb-10 px-8 mt-4">
            <Button
              type="submit"
              className={cn(
                "w-full h-12 text-base font-medium rounded-xl transition-all duration-300",
                "cursor-pointer shadow-md",
                "bg-zinc-100 text-zinc-950",
                "hover:bg-white hover:scale-[1.01] hover:shadow-xl hover:shadow-white/10",
                "active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? "Entrar no meu tempo" : "Começar sem pressa"}
                </span>
              )}
            </Button>

            <button
              type="button"
              className="text-sm cursor-pointer text-zinc-500 hover:text-zinc-300 transition-colors underline-offset-4 hover:underline decoration-zinc-700"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Ainda não tem conta? Junte-se a nós" : "Já possui conta? Voltar ao início"}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}