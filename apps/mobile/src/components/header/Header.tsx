'use client'

import { useState, useEffect, useRef } from 'react';
import { authService } from '@/app/services/auth-service';
import { useRouter } from 'next/navigation';
import { ThemeSwitcher } from '../themeSwitcher/ThemeSwitcher';
import { Settings } from '../Settings/page';

export function Header() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string>('');
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadUserData() {
            try {
                const profile = await authService.getProfile(); 
                if (profile?.email) {
                    setUserEmail(profile.email);
                }
            } catch (error) {
                console.error('Erro ao carregar dados do usuário para o Header', error);
            }
        }

        loadUserData();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

    const handleLogout = async () => {
        await authService.logout();
        router.push('/sign-in');
    };

    return (
        <>
            <header className="w-full shadow-sm border-b transition-colors duration-700"
                style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border)' }}>
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                            SlowPace
                        </span>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <ThemeSwitcher />
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                title="Menu da Conta"
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-zinc-700 hover:bg-zinc-600 transition-colors cursor-pointer shadow-sm focus:outline-none"
                            >
                                {userInitial}
                            </button>
                            {isMenuOpen && (
                                <div 
                                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 border z-50 transition-colors"
                                    style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border)' }}
                                >
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsSettingsOpen(true);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-zinc-500/10 cursor-pointer"
                                        style={{ color: 'var(--text-main)' }}
                                    >
                                        Configurações
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                                    >
                                        Sair da conta
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            {isSettingsOpen && (
                <Settings 
                    isOpen={isSettingsOpen} 
                    onClose={() => setIsSettingsOpen(false)} 
                />
            )}
        </>
    );
}