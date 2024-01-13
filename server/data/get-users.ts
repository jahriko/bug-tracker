import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  })

  return users
}

export type UsersData = Prisma.PromiseReturnType<typeof getUsers>
