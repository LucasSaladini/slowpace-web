"use client";

import { Transaction } from "@/app/services/finance-service";

interface FinanceHistoryProps {
  transactions?: Transaction[];
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function FinanceHistory({ transactions = [], loading, onEdit, onDelete }: FinanceHistoryProps) {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  if (loading) return <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Carregando fluxo de caixa...</p>;

  if (safeTransactions.length === 0) return <p className="text-sm font-light" style={{ color: 'var(--text-muted)' }}>Seu fluxo está limpo e sem pendências.</p>;

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
      {safeTransactions.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between p-3 rounded-lg border transition-all group"
          style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border)' }}
        >
          <div className="space-y-0.5">
            <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{t.description}</p>
            <span
              className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {t.category}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`text-sm font-semibold tracking-tight transition-colors duration-300 ${t.type === "EXPENSE" ? "text-rose-600/90 dark:text-rose-400/80" : ""
                }`}
              style={{ color: t.type === "INCOME" ? 'var(--text-main)' : undefined }}
            >
              {t.type === "INCOME" ? "+" : "-"} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(t)}
                className="text-xs p-1 transition-all cursor-pointer hover:underline"
                style={{ color: 'var(--text-muted)' }}
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(t.id)}
                className="text-xs p-1 transition-all hover:text-rose-500 cursor-pointer hover:underline"
                style={{ color: 'var(--text-muted)' }}
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}