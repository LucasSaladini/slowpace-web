import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/database';

export const authController = {
    async signUp(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = request.body as any;

        try {
            const userExists = await prisma.user.findUnique({ where: { email } });
            if (userExists) {
                return reply.status(400).send({ message: "Este e-mail já está em uso." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: { email, password: hashedPassword },
                select: { id: true, email: true }
            });

            const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'slowpace-secret', { expiresIn: '24h' });

            return reply.status(201).send({ token, user });
        } catch (err) {
            return reply.status(500).send({ message: "Erro ao criar conta." });
        }
    },

    async signIn(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = request.body as any;

        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return reply.status(401).send({ message: "E-mail ou senha incorretos." });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return reply.status(401).send({ message: "E-mail ou senha incorretos." });
            }

            const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'slowpace-secret');

            return reply.setCookie('slowpace.token', token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            })
                .status(200)
                .send({ user: { id: user.id, email: user.email } });
        } catch (err) {
            return reply.status(500).send({ message: "Erro interno no servidor." });
        }
    }
};