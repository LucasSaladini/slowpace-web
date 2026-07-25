'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/app/services/api';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    async function handleResetPassword() {
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (!token) {
            setError('Token de recuperação ausente.');
            return;
        }

        setLoading(true);

        try {
            await api.patch('/auth/reset-password', { token, password });

            setSuccess(true);
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Erro ao redefinir senha.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#121215] border border-[#27272a]">
            <h1 className="text-xl font-light uppercase tracking-widest text-[#a1a1aa] mb-2">SlowPace</h1>
            <h2 className="text-lg font-medium mb-6">Nova Senha</h2>

            {success ? (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-900 text-emerald-400 text-sm">
                    Senha redefinida com sucesso! Redirecionando para o login...
                </div>
            ) : (
                <div className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-900 text-rose-400 text-xs">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#a1a1aa] mb-1">Nova Senha</label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#18181b] border border-[#27272a] focus:outline-none focus:border-[#52525b] text-sm"
                            placeholder="******"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#a1a1aa] mb-1">Confirme a Nova Senha</label>
                        <input
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#18181b] border border-[#27272a] focus:outline-none focus:border-[#52525b] text-sm"
                            placeholder="******"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-[#f4f4f5] text-[#09090b] font-bold text-xs uppercase tracking-widest hover:bg-[#e4e4e7] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Redefinir Senha'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-[#f4f4f5] p-4">
            <Suspense fallback={<div className="text-xs uppercase tracking-widest text-[#a1a1aa]">Carregando...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}