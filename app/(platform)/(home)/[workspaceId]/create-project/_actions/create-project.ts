"use server"
import { getPrisma } from "@/lib/getPrisma"
import { authActionClient } from "@/lib/safe-action"
import { z } from "zod"

const schema = z.object({
  identifier: z.string().min(1, { message: "Project ID is required" }).max(3),
  name: z.string().min(2, { message: "Project name is required" }),
  description: z.string().optional(),
  workspaceUrl: z.string(),
})

export const createProject = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { identifier, name, description, workspaceUrl }, ctx: { userId } }) => {
    const workspace = await getPrisma(userId).workspace.findFirst({
      where: { url: workspaceUrl },
    })

    if (!workspace) {
      throw new Error("Workspace not found")
    }

    const project = await getPrisma(userId).project.create({
      data: {
        identifier,
        title: name,
        description: description ?? "",
        workspaceId: workspace.id,
      },
    })

    return {
      success: true,
      data: project,
    }
  })
