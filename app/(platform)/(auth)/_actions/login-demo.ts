"use server"

import { signIn } from "@/auth"
import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"
import { z } from "zod"

const schema = z.object({})

export const loginDemo = actionClient.schema(schema).action(
  async () => {
    const demoUser = await prisma.user.findFirst({
      where: {
        workspaceMembers: {
          some: {
            role: "ADMIN",
          },
        },
      },
      include: {
        workspaceMembers: {
          where: {
            role: "ADMIN",
          },
          select: {
            workspace: {
              select: {
                url: true,
              },
            },
          },
        },
      },
    })

    if (!demoUser) {
      throw new Error("Demo admin user not found. Please ensure the database is seeded with demo data.")
    }

    const lastWorkspaceUsed = demoUser.lastWorkspaceUrl ?? "create-workspace"

    await signIn("credentials", {
      email: demoUser.email,
      password: "12345678",
      redirectTo: `/${lastWorkspaceUsed}/issues`,
    })

    return { success: true }
  },
  {
    onError: (error) => {
      console.error("Demo login error:", error)
      throw new Error("Failed to log in as demo user. Please try again later.")
    },
  },
)
