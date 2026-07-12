import { z } from 'zod';

const baseAuthFields = {
    email: z.email("E-mail inválido")
        .trim()
        .toLowerCase(),
};

export const signUpSchema = z.object({
    ...baseAuthFields,
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export const signInSchema = z.object({
    ...baseAuthFields,
    password: z.string().min(1, { message: "A senha é obrigatória" }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;