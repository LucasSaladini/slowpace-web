import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { hobbyController } from '../controllers/hobby-controller';
import jwt from 'jsonwebtoken';

async function validateToken(request: FastifyRequest, reply: FastifyReply) {
    try {
        const token = request.headers.authorization?.replace('Bearer ', '') 
                      || request.cookies['slowpace.token'];

        if (!token) {
            return reply.status(401).send({ message: 'Acesso negado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
        request.user = { sub: decoded.sub };
    } catch (err) {
        return reply.status(401).send({ message: 'Sessão expirada' });
    }
}

export async function hobbyRoutes(app: FastifyInstance) {
    app.addHook('preHandler', validateToken);

    app.get('/stats', hobbyController.getStats);
    app.post('/', hobbyController.create);
    app.put('/:id', hobbyController.update);
    app.delete('/:id', hobbyController.delete);
    app.post('/sessions', hobbyController.addSession);
}