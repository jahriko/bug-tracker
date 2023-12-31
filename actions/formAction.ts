"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { IssueSchema, ProjectSchema, RegisterSchema } from "@/types"
import { hash } from "bcrypt"
import { revalidatePath } from "next/cache"

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
        title: data.title as string,
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

export async function createIssue(projectId: string, data: IssueSchema) {
  "use server"
  try {
    const session = await auth()

    if (!session) {
      throw new Error("User not authenticated.")
    }

    console.log("session::::")
    console.log(session)
    console.log(projectId)

    const { title, status, priority, description, label } = data
    await prisma.issue.create({
      data: {
        title,
        status,
        priority,
        description,
        label,
        projectId: "clq3ae1am0000q28tbx9rqzbb",
        userId: session.user.userId as string,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

export async function createUser(data: RegisterSchema) {
  try {
    const { name, email, password } = data

    const userExists = await prisma?.user.findUnique({
      where: {
        email,
      },
    })

    if (userExists) {
      return { error: "User already exists" }
    }

    await prisma?.user.create({
      data: {
        name,
        email,
        hashedPassword: await hash(password, 13),
      },
    })

    revalidatePath("/login")
  } catch (error) {
    console.error(error)
  }
}

export async function createComment(issueId: number, formData: FormData) {
  const session = await auth()

  const comment = formData.get("comment")

  if (!session || !comment) {
    return
  }

  try {
    console.log("PRISMA COMMENT CREATE")

    await prisma.comment.create({
      data: {
        text: comment as string,
        userId: session.user.userId,
        issueId,
      },
    })
  } catch (error) {
    console.log(error)
  }
}
