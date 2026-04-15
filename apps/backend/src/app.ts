import Fastify from 'fastify';
import cors from '@fastify/cors';
import { authRoutes } from './routes/auth-routes';

export const buildApp = async () => {
    const app = Fastify({ logger: true });

    await app.register(cors, { origin: true });
    await app.register(authRoutes, { prefix: '/auth' });

    return app;
};
