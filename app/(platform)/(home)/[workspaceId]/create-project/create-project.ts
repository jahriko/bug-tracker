"use server"
import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
import { z } from "zod"

const schema = z.object({
  identifier: z.string().min(2, { message: "ID is required." }),
  title: z.string().min(2, { message: "Project name is required." }),
})

export const createProject = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { title, identifier }, ctx: { userId } }) => {
    await getPrisma(userId).project.create({
      data: {
        identifier,
        title,
      },
    })

    return {
      projectName: title,
      code: "success",
      message: "Project created",
    }
  })
