"use server"
import { revalidatePath } from "next/cache"
import { ProjectSchema } from "@/lib/validations"
import prisma from "@/lib/prisma"

export async function createProject(data: ProjectSchema) {
  const { title } = ProjectSchema.parse(data)

  try {
    await prisma.project.create({
      data: {
        title,
      },
    })

    revalidatePath("/projects")

    return {
      code: "success",
      message: "Project created successfully",
    }
  } catch (error: unknown) {
    console.error("Error creating project: ", error)
    return {
      code: "error",
      message: "Error creating project",
    }
  }
}
