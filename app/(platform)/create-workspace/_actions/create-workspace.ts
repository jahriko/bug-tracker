"use server"
import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
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
    await getPrisma(userId).$transaction(async (tx) => {
      await tx.workspace.create({
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
