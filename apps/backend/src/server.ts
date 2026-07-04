import fastify from 'fastify';
import cors from '@fastify/cors';
import { authRoutes } from './routes/auth-routes';
import { hobbyRoutes } from './routes/hobby-routes';
import fastifyCookie from '@fastify/cookie';
import { financeRoutes } from './routes/finance-routes';

const app = fastify({
  logger: true,
});

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

    console.log(`CORS bloqueado para: ${origin}. Esperado: ${frontendUrl}`);
    cb(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

app.register(authRoutes, { prefix: '/auth' });
app.register(hobbyRoutes, { prefix: '/api/hobbies' });
app.register(financeRoutes, { prefix: '/api/finance' });

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;

    await app.listen({
      port,
      host: '0.0.0.0'
    });

    console.log(`🚀 Server rodando na porta: ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();