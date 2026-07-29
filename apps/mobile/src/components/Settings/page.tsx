'use client'

import { useState } from 'react';
import { authService } from '@/app/services/auth-service';
import { useRouter } from 'next/navigation';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [deleteEmail, setDeleteEmail] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    if (!isOpen) return null;

    const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('As novas senhas não coincidem.');
            return;
        }

        try {
            setIsLoadingPassword(true);
            await authService.changePassword(currentPassword, newPassword, confirmPassword);
            setPasswordSuccess('Senha alterada com sucesso!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setPasswordError(err.response?.data?.message || 'Erro ao alterar a senha.');
        } finally {
            setIsLoadingPassword(false);
        }
    };

    const handleDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setDeleteError('');

        try {
            setIsLoadingDelete(true);
            await authService.deleteAccount(deleteEmail);
            await authService.logout();
            router.push('/login');
        } catch (err: any) {
            setDeleteError(err.response?.data?.message || 'Erro ao desativar a conta.');
            setIsLoadingDelete(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div 
                className="w-full max-w-lg rounded-xl shadow-xl border overflow-hidden flex flex-col max-h-[90vh]"
                style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border)' }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-main)' }}>
                        Configurações da Conta
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer text-xl font-bold"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-8">
                    <section>
                        <h3 className="text-md font-medium mb-4" style={{ color: 'var(--text-main)' }}>
                            Alterar Senha
                        </h3>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                                    Senha Atual
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1"
                                    style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                                    Nova Senha
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1"
                                    style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                                    Confirme a Nova Senha
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1"
                                    style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                                />
                                {passwordsMismatch && (
                                    <p className="text-xs text-red-500 mt-1">Senhas não são iguais</p>
                                )}
                                {passwordsMatch && (
                                    <p className="text-xs text-green-500 mt-1">Senhas são iguais</p>
                                )}
                            </div>
                            {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                            {passwordSuccess && <p className="text-xs text-green-500">{passwordSuccess}</p>}
                            <button
                                type="submit"
                                disabled={isLoadingPassword || (confirmPassword.length > 0 && !passwordsMatch)}
                                className="px-4 py-2 text-sm font-medium rounded-md bg-zinc-700 hover:bg-zinc-600 text-white transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {isLoadingPassword ? 'Salvando...' : 'Atualizar Senha'}
                            </button>
                        </form>
                    </section>
                    <hr style={{ borderColor: 'var(--border)' }} />
                    <section>
                        <h3 className="text-md font-medium text-red-500 mb-2">
                            Zona de Perigo
                        </h3>
                        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                            Desativar sua conta iniciará o período de carência de 7 dias. Se você não fizer login nesse intervalo, todos os seus dados serão apagados permanentemente. Para confirmar, digite seu e-mail abaixo:
                        </p>
                        <form onSubmit={handleDeleteAccount} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                                    Confirme seu e-mail
                                </label>
                                <input
                                    type="email"
                                    placeholder="seu-email@dominio.com"
                                    value={deleteEmail}
                                    onChange={(e) => setDeleteEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-1 focus:ring-red-500"
                                    style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                                />
                            </div>
                            {deleteError && <p className="text-xs text-red-500">{deleteError}</p>}
                            <button
                                type="submit"
                                disabled={isLoadingDelete}
                                className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {isLoadingDelete ? 'Desativando...' : 'Excluir / Desativar Conta'}
                            </button>
                        </form>
                    </section>

                </div>
            </div>
        </div>
    );
}