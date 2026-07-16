import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/database';
import { signInSchema, signUpSchema } from '../schemas/auth-schema';

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
                .setCookie('slowpace.token', token, {
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'none'
                })
                .status(201)
                .send({
                    user: { id: user.id, email: user.email }
                });
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

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return reply.status(401).send({ message: "E-mail ou senha incorretos." });
            }

            const secret = process.env.JWT_SECRET;

            if (!secret) throw new Error("JWT_SECRET não configurado.");

            const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '24h' });

            return reply
                .setCookie('slowpace.token', token, {
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'none'
                })
                .status(200)
                .send({
                    user: { id: user.id, email: user.email }
                });
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