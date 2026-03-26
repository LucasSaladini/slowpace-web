import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { buildApp } from '../app';
import { prisma } from '../db/database';

describe('US01: Autenticação e Identificação (Base de Segurança)', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = await buildApp();
        await app.ready();

        await prisma.user.deleteMany({ where: { email: 'alex@slowpace.com' } });
    });

    afterAll(async () => {
        await app.close();
        await prisma.$disconnect();
    });

    it('deve permitir que o Alex crie uma conta com sucesso (Fluxo Feliz)', async () => {
        const response = await request(app.server)
            .post('/auth/signup')
            .send({
                email: 'alex@slowpace.com',
                password: 'Password@2026'
            });

        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.email).toBe('alex@slowpace.com');
    });

    it('RN01: deve garantir que a senha no banco não seja texto plano e use BCrypt', async () => {
        const userInDb = await prisma.user.findUnique({
            where: { email: 'alex@slowpace.com' }
        });

        if (!userInDb) throw new Error('Usuário não encontrado no banco');

        expect(userInDb.password).not.toBe('Password@2026');

        const isBcryptHash = /^\$2[ayb]\$.{56}$/.test(userInDb.password);
        expect(isBcryptHash).toBe(true);

        const passwordMatches = await bcrypt.compare('Password@2026', userInDb.password);
        expect(passwordMatches).toBe(true);
    });

    it('RN02: deve retornar um Token JWT válido com expiração de 24h', async () => {
        const response = await request(app.server)
            .post('/auth/signup')
            .send({
                email: 'novo_alex@slowpace.com',
                password: 'Password@2026'
            });

        expect(response.body).toHaveProperty('token');

        const { token } = response.body;
        const parts = token.split('.');

        expect(parts.length).toBe(3);

        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

        expect(payload).toHaveProperty('sub');

        const diffInSeconds = payload.exp - payload.iat;
        expect(diffInSeconds).toBe(86400);
    });
});