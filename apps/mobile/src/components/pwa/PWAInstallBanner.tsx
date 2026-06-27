"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

const LOCAL_STORAGE_KEY = "slowpace:pwa_installed_or_dismissed";

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<"android" | "ios" | null>(() => {
    if (typeof window === "undefined") return null;
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    return isIOSDevice ? "ios" : null;
  });
  
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    const isSaved = localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    return !isSaved && !isStandalone && isIOSDevice;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isSaved = localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (isSaved || isStandalone || isIOSDevice) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform("android");
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      localStorage.setItem(LOCAL_STORAGE_KEY, "true");
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible || !platform) return null;

  return (
    <div 
      className="fixed top-20 right-6 p-4 rounded-xl border backdrop-blur-md flex items-center gap-4 z-50 shadow-sm w-[calc(100%-3rem)] max-w-sm transition-all duration-500 ease-in-out pointer-events-auto animate-in fade-in slide-in-from-top-4"
      style={{ 
        backgroundColor: "var(--bg-card)", 
        borderColor: "var(--border)" 
      }}
    >
      <div className="space-y-0.5 flex-1">
        <p className="text-xs font-semibold" style={{ color: "var(--text-main)" }}>
          Leve o Slowpace no seu dispositivo
        </p>
        {platform === "android" ? (
          <p className="text-[11px] leading-normal" style={{ color: "var(--text-muted)" }}>
            Instale a aplicação no seu dispositivo para um espaço de foco sem distrações.
          </p>
        ) : (
          <p className="text-[11px] leading-normal inline-flex flex-wrap items-center gap-1" style={{ color: "var(--text-muted)" }}>
            Toque no botão de compartilhar
            <Share size={12} className="inline mx-0.5 text-[var(--text-main)]" />
            e selecione <span className="font-medium text-[var(--text-main)]">"Adicionar à Tela de Início"</span> para focar sem distrações.
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {platform === "android" && (
          <button
            onClick={handleInstallClick}
            className="p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center hover:opacity-80 active:scale-95"
            style={{ 
              backgroundColor: "var(--bg-app)", 
              borderColor: "var(--border)", 
              color: "var(--text-main)" 
            }}
            title="Instalar Aplicação"
          >
            <Download size={14} />
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center hover:opacity-70 text-[var(--text-muted)]"
          title="Fechar"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}