import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"
import { cn } from "@/lib/utils";

const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"], 
  variable: "--font-heading" 
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

export const metadata: Metadata = {
  title: "SlowPace | Cultivo",
  description: "Valorize seu tempo, cultive sua calma.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={cn("dark", bricolage.variable, jakarta.variable)}>
      <body className="antialiased font-sans">
        {children}
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