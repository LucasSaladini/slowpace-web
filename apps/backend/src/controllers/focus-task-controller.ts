import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../db/database";
import { z } from "zod";

interface FocusTaskBody {
    title: string;
    isCompleted: boolean;
    isBacklog?: boolean;
}

export const focusTaskController = {
    async create(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user.sub;
        const { title } = request.body as FocusTaskBody;

        try {
            if (!title || title.trim().length === 0) {
                return reply.status(400).send({ message: "O título do foco não pode estar vazio." });
            }

            const activeFocusCount = await prisma.focusTask.count({
                where: {
                    userId,
                    isBacklog: false,
                    isCompleted: false
                }
            });

            const isBacklog = activeFocusCount >= 5;

            const task = await prisma.focusTask.create({
                data: {
                    userId,
                    title: title.trim(),
                    isBacklog
                }
            });

            return reply.status(201).send(task);
        } catch (error) {
            request.log.error({
                userId,
                action: 'FOCUS_MUTATION_ERROR',
                error: error instanceof Error ? error.message : error,
                path: request.url
            });

            return reply.status(500).send({ message: "Erro ao criar foco diário." });
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
        const userId = request.user.sub;
        const { id } = request.params as { id: string }
        const { title, isCompleted, isBacklog } = request.body as FocusTaskBody;

        try {
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
                    title: title !== undefined ? title.trim() : undefined,
                    isCompleted,
                    isBacklog
                }
            });

            return reply.send(updatedTask);
        } catch (error) {
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