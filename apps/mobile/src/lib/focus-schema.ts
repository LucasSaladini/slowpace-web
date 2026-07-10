import { z } from 'zod';

export const createFocusSchema = z.object({
    title: z.string()
        .min(3, "O foco precisa de pelo menos 3 caracteres")
        .max(120, "O foco deve ser mais direto (máximo 120 caracteres)")
        .transform(val => val.trim()),

    isCompleted: z.boolean().default(false).optional(),
    isBacklog: z.boolean().default(false).optional()
});

export type CreateFocusInput = z.infer<typeof createFocusSchema>;