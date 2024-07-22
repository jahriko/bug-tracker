"use server"
import prisma from "@/lib/prisma"
import { authActionClient } from "@/lib/safe-action"
import { enhance } from "@zenstackhq/runtime"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2, { message: "Workspace name is required." }),
  url: z.string().refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
    message: "Invalid slug format",
  }),
})

export const createWorkspace = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { name, url }, ctx: { userId } }) => {
    const authZ = enhance(prisma, { user: { id: userId } })

    await prisma.$transaction(async (tx) => {
      await authZ.workspace.create({
        data: {
          name,
          url,
          ownerId: userId,
        },
      })

      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          lastWorkspaceUrl: name,
        },
      })
    })

    return {
      workspaceName: name,
      code: "success",
      message: "Workspace created",
    }
  })
