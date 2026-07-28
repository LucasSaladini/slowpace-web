import { FastifyInstance } from "fastify";
import { authController } from "../controllers/auth-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export async function authRoutes(app: FastifyInstance) {
    app.post('/signup', authController.signUp);
    app.post('/login', authController.signIn);
    app.post('/logout', { preHandler: [authMiddleware] }, authController.signOut);
    app.post('/forgot-password', authController.forgotPassword);
    app.patch('/reset-password', authController.resetPassword);
    app.patch('/change-password', { preHandler: [authMiddleware] }, authController.changePassword);
    app.delete('/delete-account', authController.deleteAccount);
    app.get('/get-user', { preHandler: [authMiddleware] }, async (request, reply) => {
        return authController.getProfile(request, reply);
    });

    app.patch('/settings/pause', { preHandler: [authMiddleware] }, authController.togglePause);
}