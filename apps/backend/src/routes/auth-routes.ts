import { FastifyInstance } from "fastify";
import { authController } from "../controllers/auth-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export async function authRoutes(app: FastifyInstance) {
    app.post('/signup', authController.signUp);
    app.post('/login', authController.signIn);

    app.patch('/settings/pause', { preHandler: [authMiddleware] }, authController.togglePause);
}