import { enhance } from '@zenstackhq/runtime';
import prisma from './prisma';

export function getPrisma(userId: string) {
  return enhance(prisma, { user: { id: userId } });
}
