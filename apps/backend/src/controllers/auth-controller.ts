import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/database';
import { signInSchema, signUpSchema } from '../schemas/auth-schema';
import z from 'zod';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../utils/mail';

const getCookieOptions = (request: FastifyRequest) => {
    const isSecure = request.protocol === 'https'; 
    return {
        path: '/',
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? ('none' as const) : ('lax' as const)
    };
};

export const authController = {
    async signUp(request: FastifyRequest, reply: FastifyReply) {
        const parseResult = signUpSchema.safeParse(request.body);

        if (!parseResult.success) {
            return reply.status(400).send({
                message: "Dados inválidos.",
                errors: parseResult.error.format()
            });
        }

        const { email, password } = parseResult.data;
        let createdUserId: string | undefined = undefined;

        try {
            const userExists = await prisma.user.findUnique({ where: { email } });
            if (userExists) {
                return reply.status(409).send({ message: "Este e-mail já está em uso." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: { email, password: hashedPassword },
                select: { id: true, email: true }
            });

            createdUserId = user.id;

            const secret = process.env.JWT_SECRET;

            if (!secret) throw new Error("JWT_SECRET não configurado.");

            const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '24h' });

            return reply
                .setCookie('slowpace.token', token, getCookieOptions(request))
                .status(201)
                .send({ user: { id: user.id, email: user.email } });
        } catch (err) {
            request.log.error({
                userId: request.user?.sub || createdUserId,
                action: 'AUTH_SIGNUP_ERROR',
                error: err instanceof Error ? err.message : err,
                path: request.url
            });
            return reply.status(500).send({ message: "Erro interno no servidor." });
        }
    },

    async signIn(request: FastifyRequest, reply: FastifyReply) {
        const parseResult = signInSchema.safeParse(request.body);

        if (!parseResult.success) {
            return reply.status(400).send({ message: "Dados inválidos." });
        }

        const { email, password } = parseResult.data;

        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return reply.status(401).send({ message: "E-mail ou senha incorretos." });
            }

            if (!user.isActive && user.deletedAt) {
                const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
                const timeElapsed = Date.now() - new Date(user.deletedAt).getTime();

                if (timeElapsed > sevenDaysInMs) {
                    await prisma.user.delete({ where: { id: user.id } });

                    return reply.status(401).send({ message: "Esta conta foi permanentemente excluída após o período de inatividade." });
                } else {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            isActive: true,
                            deletedAt: null
                        }
                    });
                }
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return reply.status(401).send({ message: "E-mail ou senha incorretos." });
            }

            const secret = process.env.JWT_SECRET;

            if (!secret) throw new Error("JWT_SECRET não configurado.");

            const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '24h' });

            return reply
                .setCookie('slowpace.token', token, getCookieOptions(request))
                .status(200)
                .send({ user: { id: user.id, email: user.email } });
        } catch (error) {
            request.log.error({
                userId: request.user?.sub,
                action: 'AUTH_SIGNIN_ERROR',
                error: error instanceof Error ? error.message : error,
                path: request.url
            });
            return reply.status(500).send({ message: "Erro ao realizar login." });
        }
    },

    async signOut(request: FastifyRequest, reply: FastifyReply) {
        const isProduction = process.env.NODE_ENV === 'production';

        return reply
            .clearCookie('slowpace.token', getCookieOptions(request))
            .status(200)
            .send({ message: "Sessão encerrada com sucesso." });
    },

    async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
        const forgotPasswordBodySchema = z.object({
            email: z.string('E-mail inválido')
        });

        const parseResult = forgotPasswordBodySchema.safeParse(request.body);

        if (!parseResult.success) {
            return reply.status(400).send({ message: "Dados inválidos." });
        }

        const { email } = parseResult.data;

        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (user) {
                const resetToken = crypto.randomUUID();
                const resetTokenExpiresAt = new Date(Date.now() + 3600000);

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        resetToken,
                        resetTokenExpiresAt,
                    }
                });

                await sendResetPasswordEmail(email, resetToken);
            }

            return reply.status(200).send({
                message: 'Se o e-mail estiver cadastrado, você receberá as instruções de recuperação em instantes.',
            });
        } catch (err) {
            request.log.error({
                action: 'AUTH_FORGOT_PASSWORD_ERROR',
                error: err instanceof Error ? err.message : err,
                path: request.url
            });
            return reply.status(500).send({ message: "Erro ao processar solicitação de recuperação de senha." });
        }
    },

    async resetPassword(request: FastifyRequest, reply: FastifyReply) {
        const resetPasswordBodySchema = z.object({
            token: z.uuid('Token inválido'),
            password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
        });

        const parseResult = resetPasswordBodySchema.safeParse(request.body);

        if (!parseResult.success) {
            return reply.status(400).send({ message: "Dados inválidos.", errors: parseResult.error.format() });
        }

        const { token, password } = parseResult.data;

        try {
            const user = await prisma.user.findFirst({
                where: {
                    resetToken: token,
                    resetTokenExpiresAt: {
                        gt: new Date()
                    }
                }
            });

            if (!user) {
                return reply.status(400).send({ message: 'Token inválido ou expirado.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    resetToken: null,
                    resetTokenExpiresAt: null
                }
            });

            const secret = process.env.JWT_SECRET;

            if(!secret) throw new Error("JWT_SECRET não configurado");

            const tokenJwt = jwt.sign({ sub: user.id }, secret, { expiresIn: '24h' });

            return reply
                .setCookie('slowpace.token', tokenJwt, getCookieOptions(request))
                .status(200)
                .send({
                    message: 'Senha redefinida com sucesso!',
                    token: tokenJwt,
                    user: { id: user.id, email: user.email }
                });
        } catch (err) {
            request.log.error({
                action: 'AUTH_RESET_PASSWORD_ERROR',
                error: err instanceof Error ? err.message : err,
                path: request.url
            });
            return reply.status(500).send({ message: "Erro ao redefinir a senha." });
        }
    },

    async changePassword(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user?.sub;

        if (!userId) {
            return reply.status(401).send({ message: "Não autorizado" });
        }

        const { currentPassword, newPassword, confirmPassword } = request.body as {
            currentPassword: string;
            newPassword: string;
            confirmPassword: string;
        };

        if (newPassword !== confirmPassword) {
            return reply.status(400).send({ message: "As senhas não coincidem" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return reply.status(404).send({ message: "Usuário não encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return reply.status(400).send({ message: "A senha atual está incorreta" });
        }

        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            });

            return reply.status(200).send({ message: "Senha alterada com sucesso" });

        } catch (err) {
            request.log.error({
                action: 'AUTH_CHANGE_PASSWORD_ERROR',
                error: err instanceof Error ? err.message : err,
                path: request.url
            });

            return reply.status(500).send({ message: "Erro ao alterar a senha" });
        }
    },

    async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user.sub;

        if (!userId) {
            return reply.status(401).send({ message: "Não autorizado" });
        }

        const { email } = request.body as { email: string };

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                return reply.status(404).send({ message: "Usuário não encontrado" });
            }

            if (user.email !== email) {
                return reply.status(400).send({ message: "O e-mail informado está incorreto" });
            }

            await prisma.user.update({
                where: { id: userId },
                data: { 
                    isActive: false,
                    deletedAt: new Date(),
                    updatedAt: new Date()
                }
            });

            return reply.status(200).send({ message: "Conta desativada com sucesso. Ela será excluída permanentemente após 7 dias se não houver novo login." });
        } catch (err) {
            request.log.error({
                action: 'AUTH_DELETE_ACCOUNT_ERROR',
                error: err instanceof Error ? err.message : err,
                path: request.url
            });

            return reply.status(500).send({ message: "Erro ao excluir a conta" });
        }
    },

    async getProfile(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user.sub;

        if (!userId) {
            return reply.status(401).send({ message: "Usuário não encontrado." });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { email: true}
            });

            if (!user) {
                return reply.status(404).send({ message: "Usuário não encontrado no banco de dados." });
            }

            return reply.status(200).send();
        } catch (err) {
            request.log.error({
                userId,
                action: 'USER_GET_INFORMATION',
                error: err instanceof Error ? err.message : err,
                path: request.url
            });
            return reply.status(500).send({ message: "Erro ao encontrar o usuário." });
        }
    },

    async completeTour(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user.sub;

        await prisma.user.update({
            where: { id: userId },
            data: { hasSeenTour: true }
        });

        return reply.status(204).send();
    },

    async togglePause(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user?.sub;

        if (!userId) {
            return reply.status(401).send({ message: "Usuário não autenticado." });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { isPaused: true }
            });

            if (!user) {
                return reply.status(404).send({ message: "Usuário não encontrado." });
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { isPaused: !user.isPaused },
                select: { id: true, isPaused: true }
            });

            return reply.status(200).send({
                message: updatedUser.isPaused
                    ? "Aplicativo pausado com sucesso. Respire fundo."
                    : "Aplicativo retomado. Bem-vindo de volta.",
                isPaused: updatedUser.isPaused
            });

        } catch (error) {
            request.log.error({
                userId,
                action: 'USER_PAUSE_MUTATION_ERROR',
                error: error instanceof Error ? error.message : error,
                path: request.url
            });
            return reply.status(500).send({ message: "Erro ao alterar estado de pausa da conta." });
        }
    }
};