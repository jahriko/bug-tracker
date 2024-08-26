import prisma from './prisma';

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  return user;
};