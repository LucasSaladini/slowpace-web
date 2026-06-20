import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../db/database';

interface TransactionBody {
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
}

export const financeController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;
    const { description, amount, type, category } = request.body as TransactionBody;

    try {
      const amountInCents = Math.round(amount * 100);

      const transaction = await prisma.transaction.create({
        data: {
          userId,
          description,
          amount: amountInCents,
          type,
          category
        }
      });

      return reply.status(201).send({
        id: transaction.id,
        userId: transaction.userId,
        description: transaction.description,
        amount: transaction.amount / 100,
        type: transaction.type,
        category: transaction.category,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      });
    } catch (error) {
      request.log.error({
        userId,
        action: 'FINANCE_MUTATION_ERROR',
        error: error instanceof Error ? error.message : error,
        path: request.url
      });
      return reply.status(500).send({ message: "Erro ao criar transação financeira." });
    }
  },

  async list(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;

    try {
      const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      const formattedTransactions = transactions.map(t => ({
        ...t,
        amount: t.amount / 100
      }));

      return reply.send(formattedTransactions);
    } catch (error) {
      request.log.error({ 
        userId, 
        action: 'FINANCE_LIST_ERROR', 
        error: error instanceof Error ? error.message : error, 
        path: request.url 
      });
      return reply.status(500).send({ message: "Erro ao carregar lançamentos." });
    }
  },
  
  async update(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;
    const { id } = request.params as { id: string };
    const { description, amount, type, category } = request.body as TransactionBody;

    try {
      const transactionExists = await prisma.transaction.findFirst({
        where: { id, userId }
      });

      if (!transactionExists) {
        return reply.status(404).send({ message: "Lançamento não encontrado ou não autorizado." });
      }

      const amountInCents = Math.round(amount * 100);

      const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data: {
          description,
          amount: amountInCents,
          type,
          category
        }
      });

      return reply.send({
        id: updatedTransaction.id,
        userId: updatedTransaction.userId,
        description: updatedTransaction.description,
        amount: updatedTransaction.amount / 100,
        type: updatedTransaction.type,
        category: updatedTransaction.category,
        createdAt: updatedTransaction.createdAt,
        updatedAt: updatedTransaction.updatedAt
      });
    } catch (error) {
      request.log.error({
        userId,
        action: 'FINANCE_MUTATION_ERROR',
        error: error instanceof Error ? error.message : error,
        path: request.url
      });
      return reply.status(500).send({ message: "Erro ao atualizar lançamento financeiro." });
    }
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;
    const { id } = request.params as { id: string };

    try {
      const transaction = await prisma.transaction.findFirst({
        where: { id, userId }
      });

      if (!transaction) {
        return reply.status(404).send({ error: 'Lançamento não encontrado ou não autorizado.' });
      }

      await prisma.transaction.delete({
        where: { id }
      });

      return reply.status(204).send();
    } catch (error) {
      request.log.error({
        userId,
        action: 'FINANCE_MUTATION_ERROR',
        error: error instanceof Error ? error.message : error,
        path: request.url
      });
      return reply.status(500).send({ message: "Erro ao remover lançamento." });
    }
  }
};