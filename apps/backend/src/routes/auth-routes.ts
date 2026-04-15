import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/database';
import { signUpSchema } from '../schemas/auth-schema';

export async function authRoutes(app: FastifyInstance) {
    app.post('/signup', async (request, reply) => {
        const parseResult = signUpSchema.safeParse(request.body);

        if (!parseResult.success) {
            return reply.status(400).send({
                message: "Dados inválidos",
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
            });

            const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '24h' });

            return reply.status(201).send({
                user: { id: user.id, email: user.email },
                token
            });
        } catch (error) {
            return reply.status(500).send({ message: "Erro interno no servidor." });
        }
    });

    app.post('/login', async (request, reply) => {
        const parseResult = signUpSchema.safeParse(request.body);

        if (!parseResult.success) {
            return reply.status(400).send({ message: "Dados inválidos" });
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

            const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '24h' });

            return reply.status(200).send({
                user: { id: user.id, email: user.email },
                token
            });
        } catch (error) {
            return reply.status(500).send({ message: "Erro ao realizar login." });
        }
    });
}