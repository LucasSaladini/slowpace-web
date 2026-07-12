import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import { authRoutes } from './routes/auth-routes';
import { hobbyRoutes } from './routes/hobby-routes';
import { financeRoutes } from './routes/finance-routes';
import { focusTaskRoutes } from './routes/focus-routes';

export const buildApp = async () => {
    const app = Fastify({ logger: true });

    app.register(fastifyCookie, {
        secret: process.env.COOKIE_SECRET,
    });

    app.register(cors, {
        origin: (origin, cb) => {
            const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");
            const allowedOrigins = [
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                frontendUrl
            ].filter(Boolean) as string[];

            if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
                cb(null, true);
                return;
            }
            cb(new Error('Not allowed by CORS'), false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    });

    app.register(authRoutes, { prefix: '/auth' });
    app.register(hobbyRoutes, { prefix: '/api/hobbies' });
    app.register(financeRoutes, { prefix: '/api/finance' });
    app.register(focusTaskRoutes, { prefix: '/api/focus' });

    return app;
};