"use server"

import { auth, authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import {
  IssueSchema,
  LoginSchema,
  ProjectSchema,
  RegisterSchema
} from "@/types"
import { compare, hash } from "bcrypt"
import { getServerSession } from "next-auth"
import { signIn } from "next-auth/react"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const schema = z.object({
	title: z.string().min(1).max(50)
})

export async function createProject(formData: FormData) {
  const parse = ProjectSchema.safeParse({
    title: formData.get("title")
  })

  if (!parse.success) {
    return { error: "Something went wrong.", project: null }
  }

  const data = parse.data

  try {
    const project = await prisma.project.create({
      data: {
        title: data.title as string
      }
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
        userId: session.user.userId as string
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function createUser(data: RegisterSchema) {
  "use server"

  try {
    const { name, email, password } = data

    const userExists = await prisma?.user.findUnique({
      where: {
        email
      }
    })

    if (userExists) {
      return { error: "User already exists" }
    }

    await prisma?.user.create({
      data: {
        name,
        email,
        hashedPassword: await hash(password, 13)
      }
    })

    revalidatePath("/login")
  } catch (error) {
    console.error(error)
  }
}
