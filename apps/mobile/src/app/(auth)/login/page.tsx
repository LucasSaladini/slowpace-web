'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema, AuthData } from '@/app/lib/auth-schema';
import { api } from '@/app/services/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Lock, UserPlus, LogIn, ArrowLeft, KeyRound } from 'lucide-react';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthData>({
        resolver: zodResolver(authSchema)
    });

    const onSubmit = async (data: AuthData) => {
        setError('');
        setSuccessMessage('');

        try {
            if (isForgotPassword) {
                const response = await api.post('auth/forgot-password', { email: data.email });
                
                setSuccessMessage(response.data.message || 'Instruções enviadas para o e-mail.');
                
                return;
            }

            if (!isLogin) {
                await api.post('auth/signup', data);
            }

            await api.post('auth/login', data);

            router.push('/dashboard');
            router.refresh();

        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Erro ao conectar ao servidor');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 selection:bg-zinc-700">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-sm p-8 bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] shadow-2xl backdrop-blur-md transition-all duration-500"
            >
                <div className="mb-10 text-center space-y-2">
                    <h1 className="text-xl font-light tracking-[0.2em] text-zinc-400 uppercase">
                        SlowPace / <span className="text-zinc-100">{isForgotPassword ? 'Recuperar' : (isLogin ? 'Login' : 'Cadastro')}</span>
                    </h1>
                    <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">
                        {isForgotPassword ? 'Redefinição de acesso' : (isLogin ? 'Retome seu cultivo' : 'Inicie sua constelação')}
                    </p>
                </div>
                <div className="space-y-5">
                    <div className="group relative">
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
                        <input
                            {...register('email')}
                            placeholder="E-mail"
                            className={`w-full py-3 pl-10 pr-4 bg-zinc-950 border rounded-2xl text-zinc-100 placeholder:text-zinc-600 text-sm transition-all outline-none focus:ring-1 focus:ring-zinc-700 ${errors.email ? 'border-red-900/50' : 'border-zinc-800 group-hover:border-zinc-700'
                                }`}
                        />
                        {errors.email && (
                            <p className="text-[10px] text-red-400 mt-1.5 ml-2 uppercase tracking-tight">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    {!isForgotPassword && (
                        <div className="group relative">
                            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
                            <input
                                {...register('password')}
                                type="password"
                                placeholder="Senha"
                                className={`w-full py-3 pl-10 pr-4 bg-zinc-950 border rounded-2xl text-zinc-100 placeholder:text-zinc-600 text-sm transition-all outline-none focus:ring-1 focus:ring-zinc-700 ${errors.password ? 'border-red-900/50' : 'border-zinc-800 group-hover:border-zinc-700'
                                    }`}
                            />
                            {errors.password && (
                                <p className="text-[10px] text-red-400 mt-1.5 ml-2 uppercase tracking-tight">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 text-[10px] text-center font-bold text-red-200 bg-red-950/20 border border-red-900/40 rounded-xl animate-in fade-in zoom-in duration-300 uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-3 text-[10px] text-center font-bold text-emerald-200 bg-emerald-950/20 border border-emerald-900/40 rounded-xl animate-in fade-in zoom-in duration-300 uppercase tracking-widest">
                            {successMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full p-4 mt-2 font-bold text-[10px] uppercase tracking-[0.3em] text-zinc-950 bg-zinc-100 rounded-2xl hover:bg-zinc-600 hover:text-zinc-100 hover:scale-[1.02] active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-black/20"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                {isForgotPassword ? <KeyRound size={14} /> : (isLogin ? <LogIn size={14} /> : <UserPlus size={14} />)}
                                {isForgotPassword ? 'Enviar Instruções' : (isLogin ? 'Entrar' : 'Criar Conta')}
                            </>
                        )}
                    </button>

                    <div className="space-y-2 pt-4">
                        {isForgotPassword ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsForgotPassword(false);
                                    setError('');
                                    setSuccessMessage('');
                                }}
                                className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                                <ArrowLeft size={12} /> Voltar para o login
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                        setSuccessMessage('');
                                    }}
                                    className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-200 transition-all cursor-pointer"
                                >
                                    {isLogin ? 'Não possui uma conta? Cadastre-se' : 'Já possui uma conta? Entre aqui'}
                                </button>

                                {isLogin && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsForgotPassword(true);
                                            setError('');
                                            setSuccessMessage('');
                                        }}
                                        className="w-full text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-400 transition-all pt-1 cursor-pointer"
                                    >
                                        Esqueceu sua senha?
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}