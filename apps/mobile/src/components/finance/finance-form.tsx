"use client";

import { useEffect } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTransactionSchema } from "@/lib/finance-schema"; 
import { CreateTransactionInput, Transaction } from "@/app/services/finance-service";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

type FinanceFormValues = typeof createTransactionSchema._input;

interface FinanceFormProps {
  onSubmit: (data: CreateTransactionInput) => Promise<void>;
  editingTransaction: Transaction | null;
  onCancelEdit: () => void;
}

export function FinanceForm({ onSubmit, editingTransaction, onCancelEdit }: FinanceFormProps) {
  const {
    handleSubmit,
    reset,
    setValue,
    control,
    clearErrors, 
    formState: { errors, isSubmitting },
  } = useForm<FinanceFormValues, any, CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    mode: "onSubmit", 
    defaultValues: {
      type: "EXPENSE",
      category: "",
      description: "",
      amount: undefined,
    },
  });

  const currentType = useWatch({
    control,
    name: "type",
    defaultValue: "EXPENSE",
  });

  useEffect(() => {
    clearErrors();

    if (editingTransaction) {
      reset({
        description: editingTransaction.description,
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category,
      });
    } else {
      reset({ 
        type: "EXPENSE", 
        category: "", 
        description: "", 
        amount: undefined 
      });
    }
  }, [editingTransaction, reset, clearErrors]);

  const handleFormSubmit = async (data: CreateTransactionInput) => {
    await onSubmit(data);
    
    if (!editingTransaction) {
      reset({
        type: "EXPENSE",
        category: "",
        description: "",
        amount: undefined, 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label style={{ color: 'var(--text-muted)' }} className="text-[11px] font-medium uppercase tracking-wider">Tipo de Fluxo</Label>
        
        {/* 🎯 Estrutura Segmentada Unificada */}
        <div 
          className="p-1 rounded-xl border flex gap-1 relative items-center transition-colors duration-500"
          style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border)' }}
        >
          <button
            type="button"
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 z-10 select-none"
            style={{
              backgroundColor: currentType === "EXPENSE" ? "var(--bg-card)" : "transparent",
              color: currentType === "EXPENSE" ? "var(--text-main)" : "var(--text-muted)",
              boxShadow: currentType === "EXPENSE" ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
            }}
            onClick={() => setValue("type", "EXPENSE")}
          >
            <ArrowDownLeft size={14} className={currentType === "EXPENSE" ? "text-rose-400" : "opacity-40"} />
            Despesa
          </button>

          <button
            type="button"
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 z-10 select-none"
            style={{
              backgroundColor: currentType === "INCOME" ? "var(--bg-card)" : "transparent",
              color: currentType === "INCOME" ? "var(--text-main)" : "var(--text-muted)",
              boxShadow: currentType === "INCOME" ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
            }}
            onClick={() => setValue("type", "INCOME")}
          >
            <ArrowUpRight size={14} className={currentType === "INCOME" ? "text-emerald-400" : "opacity-40"} />
            Receita
          </button>
        </div>
        {errors.type && <p className="text-xs text-rose-500">{errors.type.message}</p>}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="description" style={{ color: 'var(--text-muted)' }}>Descrição</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="description"
              placeholder="Ex: Assinatura de música, feira..."
              className="transition-colors border"
              style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
            />
          )}
        />
        {errors.description && <p className="text-xs text-rose-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="amount" style={{ color: 'var(--text-muted)' }}>Valor (R$)</Label>
        <Controller
          name="amount"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <Input
              {...rest}
              value={(value as number | string | undefined) ?? ""}
              id="amount"
              type="number"
              step="any"
              placeholder="0,00"
              onChange={(e) => {
                const val = e.target.value;
                onChange(val === "" ? undefined : Number(val));
              }}
              className="transition-colors border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
            />
          )}
        />
        {errors.amount && <p className="text-xs text-rose-500">{errors.amount.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="category" style={{ color: 'var(--text-muted)' }}>Categoria</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="category"
              placeholder="Ex: Alimentação, Lazer..."
              className="transition-colors border"
              style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
            />
          )}
        />
        {errors.category && <p className="text-xs text-rose-500">{errors.category.message}</p>}
      </div>

      <div className="flex gap-2 pt-2">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="flex-1 cursor-pointer font-medium hover:opacity-90"
          style={{ backgroundColor: 'var(--text-main)', color: 'var(--bg-app)' }}
        >
          {editingTransaction ? "Salvar Alteração" : "Confirmar"}
        </Button>
        {editingTransaction && (
          <Button 
            type="button" 
            variant="ghost" 
            className="cursor-pointer" 
            style={{ color: 'var(--text-muted)' }} 
            onClick={onCancelEdit}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}