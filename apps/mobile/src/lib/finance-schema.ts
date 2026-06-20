import { z } from 'zod';

export const createTransactionSchema = z.object({
  description: z.string()
    .min(3, "A descrição precisa de pelo menos 3 caracteres")
    .max(100, "Descrição muito longa"),
  
  amount: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null || (typeof val === "number" && isNaN(val))) {
        return undefined;
      }
      return val;
    },
    z.number()
      .positive("O valor deve ser maior que zero")
  ),
    
  type: z.enum(['INCOME', 'EXPENSE']),
  
  category: z.string()
    .min(2, "Selecione uma categoria válida")
    .max(30, "Categoria muito longa")
});