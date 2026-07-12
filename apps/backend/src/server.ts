import { buildApp } from './app';

const start = async () => {
  try {
    const app = await buildApp();
    const port = Number(process.env.PORT) || 3333;

    await app.listen({
      port,
      host: '0.0.0.0'
    });

    console.log(`🚀 Server rodando de forma unificada na porta: ${port}`);
  } catch (err) {
    process.exit(1);
  }
}

start();