import prisma from "@/lib/prisma"

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findFirst({
      where: { email },
    })
  } catch (error) {
    console.error("Failed to fetch user: ", error)
    throw new Error("Failed to fetch user.")
  }
}
