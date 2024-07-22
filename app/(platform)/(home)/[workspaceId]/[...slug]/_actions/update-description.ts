"use server"
import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
import { z } from "zod"

const schema = z.object({
  issueId: z.number(),
  description: z.string(),
})

export const updateDescription = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { issueId, description }, ctx: { userId } }) => {
    await getPrisma(userId).issue.update({
      where: {
        id: issueId,
      },
      data: {
        description,
      },
    })
  })
