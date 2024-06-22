import prisma from "@/lib/prisma"

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findFirstOrThrow({
      where: { email },
    })
  } catch (error) {
    throw new Error("Failed to fetch user.")
  }
}
