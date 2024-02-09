import { PromiseReturnType } from "@prisma/client"
import prisma from "@/lib/prisma"

export const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  })

  console.log("fetching users")

  return users
)

  export type UsersData = PromiseReturnType<typeof getUsers>