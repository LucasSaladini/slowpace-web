import { z } from 'zod';

export const signUpSchema = z.object({
    email: z.email("E-mail inválido"),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;