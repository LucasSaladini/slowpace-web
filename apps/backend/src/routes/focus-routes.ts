import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { focusTaskController } from '../controllers/focus-task-controller';
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

export async function focusTaskRoutes(app: FastifyInstance) {
    app.addHook('preHandler', validateToken);

    app.post('/', focusTaskController.create)
    app.get('/', focusTaskController.list)
    app.put('/:id', focusTaskController.update)
    app.delete('/:id', focusTaskController.delete)
}