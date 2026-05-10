export function StatsSummary({ totalMinutes }: { totalMinutes: number }) {
  const hours = Math.floor(totalMinutes / 60);
  
  return (
    <div className="text-center space-y-4 py-8">
      <h2 className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
        Tempo Dedicado
      </h2>
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-7xl font-light tracking-tighter" style={{ color: 'var(--text-main)' }}>
          {hours}
        </span>
        <span className="text-2xl font-light italic" style={{ color: 'var(--text-muted)' }}>horas</span>
      </div>
      <p className="text-sm max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Sua evolução não é uma corrida, é um acúmulo de momentos significativos.
      </p>
    </div>
  );
}