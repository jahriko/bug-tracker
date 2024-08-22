import { type Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  return users;
};

export type UsersData = Prisma.PromiseReturnType<typeof getUsers>;
