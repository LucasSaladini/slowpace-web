"use client";

import { useState, useEffect } from "react";
import { financeService, Transaction, CreateTransactionInput } from "@/app/services/finance-service";
import { FinanceForm } from "./finance-form";
import { FinanceHistory } from "./finance-history";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { FinanceChart } from "./finance-chart";

export function FinanceContainer() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await financeService.getTransactions();
      setTransactions(data);
    } catch (err) {
      toast.error("Não foi possível carregar o fluxo financeiro.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleFormSubmit = async (data: CreateTransactionInput) => {
    try {
      if (editingTransaction) {
        const updatedData = await financeService.updateTransaction(editingTransaction.id, data);
        
        setTransactions(prev => 
          prev.map(t => t.id === editingTransaction.id ? updatedData : t)
        );
        
        setEditingTransaction(null);
        
        toast.success("Lançamento atualizado com sucesso.");
      } else {
        const newTransaction = await financeService.createTransaction(data);
        
        setTransactions(prev => [newTransaction, ...prev]);
        
        toast.success("Lançamento adicionado.");
      }
    } catch (error) {
      console.error("Erro ao processar transação:", error);
      toast.error("Erro ao salvar lançamento.");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await financeService.deleteTransaction(id);
      
      toast.success("Lançamento removido em silêncio.");
      
      loadTransactions();
    } catch (err) {
      toast.error("Erro ao remover lançamento.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <Card 
        className="md:col-span-1 border backdrop-blur-sm transition-colors duration-500"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <CardHeader>
          <CardTitle className="text-lg font-medium" style={{ color: 'var(--text-main)' }}>
            {editingTransaction ? "Ajustar Lançamento" : "Registrar Fluxo"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FinanceForm
            onSubmit={handleFormSubmit}
            editingTransaction={editingTransaction}
            onCancelEdit={() => setEditingTransaction(null)}
          />
        </CardContent>
      </Card>

      <Card 
        className="md:col-span-2 border backdrop-blur-sm transition-colors duration-500"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <CardHeader>
          <CardTitle className="text-lg font-medium" style={{ color: 'var(--text-main)' }}>Histórico do Fluxo</CardTitle>
        </CardHeader>
        <CardContent>
          {!loading && <FinanceChart transactions={transactions} />}
          <FinanceHistory
            transactions={transactions}
            loading={loading}
            onEdit={setEditingTransaction}
            onDelete={handleDeleteTransaction}
          />
        </CardContent>
      </Card>
    </div>
  );
}