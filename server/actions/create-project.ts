"use server"
import prisma from "@/lib/prisma"
import { ProjectSchema } from "@/lib/validations"
import { revalidatePath } from "next/cache"

export async function createProject(data: ProjectSchema) {
  const { workspaceId, title } = ProjectSchema.parse(data)

  try {
    await prisma.project.create({
      data: {
        workspaceId,
        title,
      },
    })

    revalidatePath("/workspace")

    return {
      code: "success",
      message: `Project ${title} created.`,
    }
  } catch (error: unknown) {
    console.error("Error creating project: ", error)
    return {
      code: "error",
      message: "Error creating project",
    }
  }
}
