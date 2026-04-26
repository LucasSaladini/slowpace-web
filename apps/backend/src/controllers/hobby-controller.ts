import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../db/database';
import { getRandomPhrase } from '../utils/encouragement';

export const hobbyController = {
  async getStats(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;

    try {
      const hobbies = await prisma.hobby.findMany({
        where: { userId },
        include: {
          sessions: {
            select: { duration: true }
          }
        }
      });

      const totalMinutes = hobbies.reduce((acc, hobby) => {
        const hobbyMinutes = hobby.sessions.reduce((sAcc, s) => sAcc + s.duration, 0);
        return acc + hobbyMinutes;
      }, 0);
      const stardustData = hobbies.map(hobby => ({
        id: hobby.id,
        name: hobby.name,
        color: hobby.color || '#71717a',
        frequency: hobby.frequency,
        totalMinutes: hobby.sessions.reduce((acc, s) => acc + s.duration, 0)
      }));

      return reply.send({
        totalHours: Math.floor(totalMinutes / 60),
        totalMinutes,
        stardustData
      });
    } catch (error) {
      return reply.status(500).send({ message: "Erro ao carregar estatísticas." });
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
    const { hobbyId, duration, content, createdAt } = request.body as { 
      hobbyId: string;
      duration: number;
      content?: string;
      createdAt?: string;
    };

    try {
      const session = await prisma.session.create({
        data: {
          hobbyId,
          duration,
          content,
          ...(createdAt && { create: new Date(createdAt) })
        }
      });

      const phrase = getRandomPhrase();

      return reply.status(201).send({ session, message: phrase });
    } catch (error) {
      return reply.status(500).send({ message: "Erro ao registrar tempo." });
    }
  },

  async getHistory(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;
    const history = await prisma.session.findMany({
      where: { hobby: { userId } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { hobby: { select: { name: true, color: true } } }
    });

    return reply.send(history);
  }
};