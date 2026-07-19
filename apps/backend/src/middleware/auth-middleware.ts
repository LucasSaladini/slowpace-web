import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  console.log('--- DEBUG AUTH ---');
  console.log('Cookies recebidos:', request.cookies);
  console.log('Authorization header:', request.headers.authorization);

  try {
    const token = request.headers.authorization?.replace('Bearer ', '')
      || request.cookies['slowpace.token'];

    if (!token || token === 'undefined') {
      return reply.status(401).send({ message: 'Não autorizado' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET não configurado");
    }

    const decoded = jwt.verify(token, secret) as { sub: string };

    request.user = { sub: decoded.sub };

  } catch (err) {
    console.log('FALHA: Erro no JWT verify', err);
    return reply.status(401).send({ message: 'Sessão inválida ou expirada' });
  }
}