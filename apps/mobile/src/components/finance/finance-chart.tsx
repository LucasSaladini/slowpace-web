"use client";

import { useMemo, useState } from "react";
import { Transaction } from "@/app/services/finance-service";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface FinanceChartProps {
  transactions: Transaction[];
}

export function FinanceChart({ transactions }: FinanceChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { chartData, balance } = useMemo(() => {
    let incomeSum = 0;
    let expenseSum = 0;

    for (const t of transactions) {
      if (t.type === "INCOME") {
        incomeSum += t.amount;
      } else {
        expenseSum += t.amount;
      }
    }

    const data = [];
    if (incomeSum > 0) {
      data.push({ 
        name: "Receitas", 
        value: Number(incomeSum.toFixed(2)), 
        type: "INCOME",
        fill: "var(--accent)" 
      });
    }
    if (expenseSum > 0) {
      data.push({ 
        name: "Despesas", 
        value: Number(expenseSum.toFixed(2)), 
        type: "EXPENSE",
        fill: "var(--text-muted)" 
      });
    }

    return {
      chartData: data,
      balance: incomeSum - expenseSum,
    };
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center border border-dashed rounded-xl bg-[var(--bg-app)]/20" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-light" style={{ color: 'var(--text-muted)' }}>Dados insuficientes para gerar o balanço financeiro.</p>
      </div>
    );
  }

  const renderCenterText = () => {
    if (activeIndex !== null && chartData[activeIndex]) {
      const activeData = chartData[activeIndex];
      return (
        <>
          <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>
            Total {activeData.name}
          </span>
          <span className="text-lg font-bold tracking-tight mt-0.5 transition-all duration-300" style={{ color: 'var(--text-main)' }}>
            R$ {activeData.value.toFixed(2)}
          </span>
        </>
      );
    }

    return (
      <>
        <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>
          Saldo Atual
        </span>
        {/* 🎯 Mudança aqui: O saldo assume var(--text-main) para contraste perfeito em Light, Sepia e Dark.
            A distinção de positivo/negativo é feita pelo sinal (+/-) e por uma classe suave condicional de cor se for negativo. */}
        <span 
          className={`text-lg font-bold tracking-tight mt-0.5 transition-all duration-300 ${
            balance < 0 ? "text-rose-500/90 dark:text-rose-400" : ""
          }`} 
          style={{ color: balance >= 0 ? 'var(--text-main)' : undefined }}
        >
          {balance >= 0 ? "+" : ""}R$ {balance.toFixed(2)}
        </span>
      </>
    );
  };

  return (
    <div className="w-full h-[240px] pt-4 flex items-center justify-center relative select-none min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
            stroke="var(--bg-card)"
            strokeWidth={2}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            style={{ cursor: "pointer" }}
          >
            {chartData.map((entry, index) => {
              const isDimmed = activeIndex !== null && activeIndex !== index;
              return (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.fill}
                  style={{
                    opacity: isDimmed ? 0.25 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        {renderCenterText()}
      </div>
    </div>
  );
}