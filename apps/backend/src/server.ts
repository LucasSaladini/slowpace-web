import fastify from 'fastify';
import cors from '@fastify/cors';
import { authRoutes } from './routes/auth-routes';
import { hobbyRoutes } from './routes/hobby-routes';
import fastifyCookie from '@fastify/cookie';

const app = fastify({ 
  logger: true,
});

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});

app.register(cors, {
    origin: (origin, cb) => {
      const allowedOrigins = ['http://localhost:3000', process.env.FRONTEND_URL];
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

app.register(authRoutes, { prefix: '/auth' });
app.register(hobbyRoutes, { prefix: '/api/hobbies'});

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