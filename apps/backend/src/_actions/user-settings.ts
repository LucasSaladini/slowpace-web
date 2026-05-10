'use server'

import { prisma } from '../db/database';

export async function togglePauseMode(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isPaused: true }
    });

    if (!user) {
        throw new Error("Usuário não encontrado no banco de dados");
    }

    const updateUser = await prisma.user.update({
        where: { id: userId },
        data: {
            isPaused: !user.isPaused,
            pausedAt: !user.isPaused ? new Date() : null 
        }
    });

    return { isPaused: updateUser.isPaused };
}