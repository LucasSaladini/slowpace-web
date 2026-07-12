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

            const secret = process.env.JWT_SECRET;

            if (!secret) throw new Error("JWT_SECRET não configurado.");

            const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '24h' });

            return reply
                .setCookie('slowpace.token', token, {
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                })
                .status(201)
                .send({
                    user: { id: user.id, email: user.email }
                });
        } catch (err) {
            request.log.error(err);
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
                    sameSite: 'lax'
                })
                .status(200)
                .send({
                    user: { id: user.id, email: user.email }
                });
        } catch (error) {
            request.log.error(error);
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
    }
};