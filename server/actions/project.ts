import { revalidatePath } from "next/cache"
import { ProjectSchema } from "@/types"
import prisma from "@/lib/prisma"

export async function createProject(formData: FormData) {
  const parse = ProjectSchema.safeParse({
    title: formData.get("title"),
  })

  if (!parse.success) {
    return { error: "Something went wrong.", project: null }
  }

  const data = parse.data

  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
      },
    })

    if (project) {
      return { error: "Project already exists.", project: null }
    }

    revalidatePath("/projects")
    return { message: "Project created successfully.", project: project }
  } catch (error) {
    return { message: "Something went wrong.", project: null }
  }
}
