import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../db/database';
import { getRandomPhrase } from '../utils/encouragement';

export const hobbyController = {
  async getStats(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.sub;

    if (!userId) {
      return reply.status(401).send({ message: "Usuário não autenticado." });
    }

    try {
      const totalMinutesAggregate = await prisma.session.aggregate({
        where: {
          hobby: { userId }
        },
        _sum: {
          duration: true
        }
      });

      const totalMinutes = totalMinutesAggregate._sum.duration || 0;

      const hobbyGroups = await prisma.session.groupBy({
        by: ['hobbyId'],
        where: {
          hobby: { userId }
        },
        _sum: {
          duration: true
        }
      });

      const hobbies = await prisma.hobby.findMany({
        where: { userId },
        select: { id: true, name: true, color: true }
      });

      const stardustData = hobbyGroups.map(group => {
        const hobbyInfo = hobbies.find(h => h.id === group.hobbyId);

        return {
          hobbyId: group.hobbyId,
          name: hobbyInfo?.name || "Desconhecido",
          color: hobbyInfo?.color || "#CCCCCC",
          totalDuration: group._sum.duration || 0,
        };
      });

      return reply.status(200).send({
        totalMinutes,
        stardustData
      });
    } catch (error) {
      request.log.error({
        userId,
        action: 'HOBBY_STATS_QUERY_ERROR',
        error: error instanceof Error ? error.message : error,
        path: request.url
      });

      return reply.status(500).send({ message: "Erro ao compilar estatísticas dos hobbies." });
    }
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { name, color, frequency } = request.body as any;
    const userId = request.user.sub;

    try {
      const hobby = await prisma.hobby.create({
        data: { name, color, frequency: frequency || "daily", userId }
      });
      return reply.status(201).send(hobby);
    } catch (error) {
      return reply.status(500).send({ message: "Erro ao criar hobby." });
    }
  },
  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { name, color, frequency } = request.body as any;
    const userId = request.user.sub;

    try {
      const hobby = await prisma.hobby.update({
        where: { id, userId },
        data: { name, color }
      });
      return reply.send(hobby);
    } catch (error) {
      return reply.status(500).send({ message: "Erro ao atualizar hobby." });
    }
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const userId = request.user.sub;

    try {
      await prisma.session.deleteMany({ where: { hobbyId: id } });
      await prisma.hobby.delete({ where: { id, userId } });
      return reply.status(204).send();
    } catch (error) {
      return reply.status(500).send({ message: "Erro ao deletar hobby." });
    }
  },

  async addSession(request: FastifyRequest, reply: FastifyReply) {
    const { hobbyId, duration, content, createdAt } = request.body as any;
    const userId = request.user.sub;

    try {
      const session = await prisma.session.create({
        data: {
          hobbyId,
          duration,
          content,
          ...(createdAt && { createdAt: new Date(createdAt) })
        }
      });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isPaused: true }
      });

      const phrase = user?.isPaused
        ? "Registro salvo em silêncio. Continue descansando."
        : getRandomPhrase();

      return reply.status(201).send({ session, message: phrase });
    } catch (error) {
      return reply.status(500).send({ message: "Erro ao registrar tempo." });
    }
  },

  async getHistory(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isPaused: true }
      });

      if (user?.isPaused) {
        return reply.send([]);
      }

      const history = await prisma.session.findMany({
        where: { hobby: { userId } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { hobby: { select: { name: true, color: true } } }
      });

      return reply.send(history);
    } catch (error) {
      return reply.status(500).send({ message: "Erro ao carregar histórico." });
    }
  },

  async togglePause(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isPaused: true }
      });

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isPaused: !user?.isPaused },
        select: { isPaused: true }
      });

      return reply.send({ isPaused: updatedUser.isPaused });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro ao alterar estado de pausa." });
    }
  },

  async completeTour(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { hasSeenTour: true }
      });

      return reply.status(204).send();
    } catch (error) {
      return reply.status(500).send({ message: "Erro ao atualizar estado do tour." });
    }
  }
};