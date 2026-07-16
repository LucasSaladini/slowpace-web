'use client'

import { authService } from '@/app/services/auth-service';
import { useRouter } from 'next/navigation';
import { ThemeSwitcher } from '../themeSwitcher/ThemeSwitcher';

export function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        await authService.logout();
    };

    return (
        <header className="w-full shadow-sm border-b transition-colors duration-700"
            style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border)' }}>
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                        SlowPace
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 border border-transparent hover:border-zinc-500 cursor-pointer"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        Sair da conta
                    </button>
                </div>

            </div>
        </header>
    );
}