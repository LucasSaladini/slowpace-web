import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../db/database";
import { z } from "zod";

interface FocusTaskBody {
    title: string;
    isCompleted: boolean;
    isBacklog?: boolean;
}

const createFocusSchema = z.object({
    title: z.string()
        .min(1, "O título do foco não pode estar vazio.")
        .max(255)
        .transform(t => t.trim())
});

const updateFocusSchema = z.object({
    title: z.string()
        .min(1, "O título do foco não pode estar vazio.")
        .max(255)
        .transform(t => t.trim())
        .optional(),
    isCompleted: z.boolean().optional(),
    isBacklog: z.boolean().optional()
});

export const focusTaskController = {
    async create(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user?.sub;

        if (!userId) {
            return reply.status(401).send({ message: "Usuário não autenticado." });
        }

        try {
            const { title } = createFocusSchema.parse(request.body);
            const activeFocusCount = await prisma.focusTask.count({
                where: {
                    userId,
                    isBacklog: false,
                    isCompleted: false
                }
            });

            const task = await prisma.focusTask.create({
                data: {
                    userId,
                    title,
                    isBacklog: activeFocusCount >= 5
                }
            });

            return reply.status(201).send(task);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ message: error.message })
            }

            request.log.error({
                userId,
                action: 'FOCUS_MUTATION_ERROR',
                error: error instanceof Error ? error.message : error,
                path: request.url
            });

            return reply.status(500).send({ message: "Erro ao criar tarefa de foco." });
        }
    },

    async list(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user.sub;

        try {
            const tasks = await prisma.focusTask.findMany({
                where: { userId },
                orderBy: { createdAt: 'asc' }
            });

            return reply.send(tasks)
        } catch (error) {
            request.log.error({
                userId,
                action: 'FOCUS_LIST_ERROR',
                error: error instanceof Error ? error.message : error,
                path: request.url
            });

            return reply.status(500).send({ message: "Erro ao carregar focus diários." });
        }
    },

    async update(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user?.sub;
        const { id } = request.params as { id: string };

        if (!userId) {
            return reply.status(401).send({ message: "Usuário não autenticado." });
        }

        try {
            const parsedBody = updateFocusSchema.parse(request.body);
            const { title, isCompleted, isBacklog } = parsedBody;

            const taskExists = await prisma.focusTask.findFirst({
                where: { id, userId }
            });

            if (!taskExists) {
                return reply.status(404).send({ message: "Foco diário não encontrado ou não autorizado." });
            }

            if (isBacklog === false && taskExists.isBacklog === true) {
                const activeFocusCount = await prisma.focusTask.count({
                    where: {
                        userId,
                        isBacklog: false,
                        isCompleted: false
                    }
                });

                if (activeFocusCount >= 5) {
                    return reply.status(400).send({ message: "Reduza sua carga atual antes de trazer um novo foco para o seu dia." });
                }
            }

            const updatedTask = await prisma.focusTask.update({
                where: { id },
                data: {
                    title,
                    isCompleted,
                    isBacklog
                }
            });

            return reply.send(updatedTask);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ message: error.message });
            }

            request.log.error({
                userId,
                action: 'FOCUS_MUTATION_ERROR',
                error: error instanceof Error ? error.message : error,
                path: request.url
            });

            return reply.status(500).send({ message: "Erro ao atualizar foco diário." });
        }
    },

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user.sub;
        const { id } = request.params as { id: string };

        try {
            const task = await prisma.focusTask.findFirst({
                where: { id, userId }
            });

            if (!task) {
                return reply.status(404).send({ message: "Foco diário não encontrado ou não autorizado." });
            }

            await prisma.focusTask.delete({
                where: { id }
            });

            return reply.status(204).send();
        } catch (error) {
            request.log.error({
                userId,
                action: 'FOCUS_MUTATION_ERROR',
                error: error instanceof Error ? error.message : error,
                path: request.url
            });
            return reply.status(500).send({ message: "Erro ao remover foco diário." });
        }
    }
};