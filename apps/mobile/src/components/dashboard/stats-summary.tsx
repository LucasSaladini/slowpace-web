export function StatsSummary({ totalMinutes }: { totalMinutes: number }) {
  const hours = Math.floor(totalMinutes / 60);
  
  return (
    <div className="text-center space-y-4 py-8">
      <h2 className="text-zinc-500 text-xs font-medium tracking-[0.2em] uppercase">
        Tempo Dedicado
      </h2>
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-7xl font-light tracking-tighter text-zinc-100">
          {hours}
        </span>
        <span className="text-2xl font-light text-zinc-500 italic">horas</span>
      </div>
      <p className="text-zinc-600 text-sm max-w-xs mx-auto leading-relaxed">
        Sua evolução não é uma corrida, é um acúmulo de momentos significativos.
      </p>
    </div>
  );
}