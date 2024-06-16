"use server"

import { hash } from "bcrypt"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { RegisterSchema } from "@/types"

export async function createUser(data: RegisterSchema) {
  try {
    const { name, email, password } = data

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userExists) {
      return { error: "User already exists" }
    }

    await prisma.user.create({
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
