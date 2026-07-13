import { FastifyInstance } from 'fastify';
import { focusTaskController } from '../controllers/focus-task-controller';
import { authMiddleware } from '../middleware/auth-middleware';

export async function focusTaskRoutes(app: FastifyInstance) {
    app.addHook('preHandler', authMiddleware);

    app.post('/', focusTaskController.create);
    app.get('/', focusTaskController.list);
    app.put('/:id', focusTaskController.update);
    app.delete('/:id', focusTaskController.delete);
}