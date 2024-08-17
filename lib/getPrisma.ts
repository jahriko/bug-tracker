import 'server-only';

import { enhance } from '@zenstackhq/runtime';

import prisma from './prisma';

// Extending the enhanced prisma client returns the base Prisma :/ bummer...
// https://github.com/zenstackhq/zenstack/issues/1173
export function getPrisma(userId: string) {
  return enhance(prisma, { user: { id: userId } });
}
