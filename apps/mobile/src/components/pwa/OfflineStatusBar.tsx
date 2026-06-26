"use client"

import { useSyncExternalStore } from "react";
import { CloudOff } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function OfflineStatusBar() {
  const isOnline = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  );

  const isOffline = !isOnline;

  if (!isOffline) return null;

    return (
        <div 
            className="fixed top-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full border flex items-center gap-2 z-50 shadow-sm animate-in fade-in zoom-in-95"
            style={{ 
                backgroundColor: "var(--bg-card)", 
                borderColor: "var(--border)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)"
            }}
        >
            <CloudOff size={13} className="text-rose-400 opacity-90 shrink-0" />
            <span
                className="text-[10px] font-medium tracking-wider uppercase select-none"
                style={{ color: "var(--text-muted)" }}
            >
                Modo Offline - Ritmo Preservado
            </span>
        </div>
    )
}