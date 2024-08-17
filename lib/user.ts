import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findFirstOrThrow({
      where: { email },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        console.error(e.message);
      }
    }
    throw e;
  }
}
