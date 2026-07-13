import { FastifyInstance } from 'fastify';
import { hobbyController } from '../controllers/hobby-controller';
import { authMiddleware } from '../middleware/auth-middleware';

export async function hobbyRoutes(app: FastifyInstance) {
    app.addHook('preHandler', authMiddleware);

    app.get('/stats', hobbyController.getStats);
    app.post('/', hobbyController.create);
    app.put('/:id', hobbyController.update);
    app.delete('/:id', hobbyController.delete);

    app.post('/sessions', hobbyController.addSession);
    app.get('/sessions/history', hobbyController.getHistory);
    app.patch('/settings/tour', hobbyController.completeTour);
}