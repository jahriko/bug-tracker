"use server"
import prisma from "@/lib/prisma"
import { authActionClient } from "@/lib/safe-action"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2, { message: "Workspace name is required." }),
})

export const createWorkspace = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { name }, ctx: { userId } }) => {
    try {
      const createdWorkspace = await prisma.workspace.create({
        data: {
          name,
        },
      })

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          lastWorkspaceUrl: createdWorkspace.name,
        },
      })

      return {
        workspaceName: createdWorkspace.name,
        code: "success",
        message: "Workspace created",
      }
    } catch (error) {
      console.error(error)
      return {
        code: "error",
        message: "Error creating workspace",
      }
    }
  })
