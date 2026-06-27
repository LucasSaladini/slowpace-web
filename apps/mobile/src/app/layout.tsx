import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"
import { cn } from "@/lib/utils";
import { OfflineStatusBar } from "@/components/pwa/OfflineStatusBar";
import { PWAInstallBanner } from "@/components/pwa/PWAInstallBanner";

const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"], 
  variable: "--font-heading" 
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

export const viewport: Viewport = {
  themeColor: "#121214",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Slowpace",
  description: "Cultive seu ritmo de forma sustentável.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon.ico?v=2", sizes: "any" },
      { url: "/icons/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/icons/favicon-96x96.png?v=2", sizes: "96x96", type: "image/png" },
      { url: "/icons/web-app-manifest-192x192.png?v=2", sizes: "192x192", type: "image/png" }
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Slowpace",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={cn("dark", bricolage.variable, jakarta.variable)}>
      <body className="antialiased font-sans">
        {children}
        <OfflineStatusBar />
        <PWAInstallBanner />
        <Toaster
          toastOptions={{
            classNames: {
              toast: "group toast rounded-xl border shadow-2xl transition-all duration-300 font-sans",
              error: cn(
                "!bg-rose-950/95 !border-rose-900/50 !text-zinc-50",
                "[&_[data-description]]:!text-rose-100/70",
                "[&_[data-icon]]:text-rose-400"
              ),
              success: "!bg-emerald-950/95 !border-emerald-900/50 !text-zinc-50 font-display",
              info: "!bg-zinc-900 !border-zinc-800 !text-zinc-50",
            },
          }}
        />
      </body>
    </html>
  )
}