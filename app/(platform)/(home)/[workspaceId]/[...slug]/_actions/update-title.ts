"use server"
import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
import { z } from "zod"

const schema = z.object({
  issueId: z.number(),
  title: z.string(),
})

export const updateTitle = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { issueId, title }, ctx: { userId } }) => {
    await getPrisma(userId).issue.update({
      where: {
        id: issueId,
      },
      data: {
        title,
      },
    })
  })
