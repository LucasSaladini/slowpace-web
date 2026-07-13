import { FastifyInstance } from 'fastify';
import { financeController } from '../controllers/finance-controller';
import { authMiddleware } from '../middleware/auth-middleware';

export async function financeRoutes(app: FastifyInstance) {
    app.addHook('preHandler', authMiddleware);

    app.post('/transactions', financeController.create);
    app.get('/transactions', financeController.list);
    app.put('/transactions/:id', financeController.update);
    app.delete('/transactions/:id', financeController.delete);
}