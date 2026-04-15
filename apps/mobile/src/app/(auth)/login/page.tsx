'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema, AuthData } from '@/app/lib/auth-schema';
import { authService } from '@/app/services/auth-service';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [error, setError] = useState('');
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthData>({
        resolver: zodResolver(authSchema)
    });

    const onSubmit = async (data: AuthData) => {
        try {
            await authService.signUp(data);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao conectar ao servidor');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-slate-800">Bem-vindo ao SlowPace</h1>

                <div className="space-y-4">
                    <div>
                        <input
                            {...register('email')}
                            placeholder="E-mail"
                            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="Senha"
                            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
                        />
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    {error && <p className="p-2 text-sm text-center text-red-600 bg-red-50 rounded">{error}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full p-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isSubmitting ? 'Processando...' : 'Entrar / Criar Conta'}
                    </button>
                </div>
            </form>
        </div>
    );
}