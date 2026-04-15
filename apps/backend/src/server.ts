import fastify from 'fastify';
import cors from '@fastify/cors';
import { authRoutes } from './routes/auth-routes';
import { hobbyRoutes } from './routes/hobby-routes';
import fastifyCookie from '@fastify/cookie';

const app = fastify({ logger: true });

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});
app.register(cors, {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
})
app.register(authRoutes, { prefix: '/auth' });
app.register(hobbyRoutes, { prefix: '/api/hobbies'})

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