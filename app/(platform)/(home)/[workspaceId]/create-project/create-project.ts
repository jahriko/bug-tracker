"use server"
import prisma from "@/lib/prisma"
import { authActionClient } from "@/lib/safe-action"
import { enhance } from "@zenstackhq/runtime"
import { z } from "zod"

const schema = z.object({
  id: z.string().min(2, { message: "ID is required." }),
  title: z.string().min(2, { message: "Project name is required." }),
})

export const createProject = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { title, id }, ctx: { userId } }) => {
    const authZ = enhance(prisma, { user: { id: userId } })

    await authZ.project.create({
      data: {
        id,
        title,
      },
    })

    return {
      projectName: title,
      code: "success",
      message: "Project created",
    }
  })
