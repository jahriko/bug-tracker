import { Prisma, PrismaClient } from "@prisma/client"
import { enhance } from "@zenstackhq/runtime"
import "server-only"
import { handleDatabaseError } from "./error"
import { User, getCurrentUser } from "./get-current-user"
import prisma from "./prisma"

// Create a higher-order function to inject the session into database operations
export const dbWithSession = <T, Args extends unknown[]>(
  operation: (
    enhancedPrisma: PrismaClient<Prisma.PrismaClientOptions, never>,
    session: User,
    ...args: Args
  ) => Promise<T>,
) => {
  return async (...args: Args): Promise<T> => {
    try {
      const session = await getCurrentUser()
      const enhancedPrisma = enhance(prisma, { user: { id: session.userId } })
      return operation(enhancedPrisma, session, ...args)
    } catch (error) {
      handleDatabaseError(error)
    }
  }
}
