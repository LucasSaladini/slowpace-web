import { z } from 'zod';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const baseAuthFields = {
    email: z.string()
        .trim()
        .toLowerCase()
        .refine((val) => emailRegex.test(val), {
            message: "E-mail inválido"
        })
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