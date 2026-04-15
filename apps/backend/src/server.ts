import fastify from 'fastify';
import cors from '@fastify/cors';
import { authRoutes } from './routes/auth-routes';

const app = fastify({ logger: true });

app.register(cors, {
    origin: true,
});
app.register(authRoutes, { prefix: '/auth' });

const start = async () => {
    try {
        await app.listen({ port: 3333, host: '0.0.0.0' });
        console.log('🚀 SlowPace Backend rodando em http://localhost:3333');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();