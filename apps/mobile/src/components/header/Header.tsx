'use client'

import { authService } from '@/app/services/auth-service';
import { useRouter } from 'next/navigation';

export function Header() {
    const router = useRouter();

    const handleLogout = () => {
        authService.logout();
        
        router.push('/');
    };

    return (
        <header className="w-full bg-zinc-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-zinc-500 tracking-tight">
                        SlowPace
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-zinc-500 rounded-md transition-all duration-200 border border-transparent hover:border-red-100 cursor-pointer"
                >
                    Sair da conta
                </button>
            </div>
        </header>
    );
}