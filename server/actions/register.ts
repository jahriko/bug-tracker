"use server"

import bcrypt from "bcryptjs"
import {
  type RegisterSchema as RegisterSchemaType,
  RegisterSchema,
} from "@/types"
import { getUserByEmail } from "@/lib/user"
import prisma from "@/lib/prisma"
import { faker } from "@faker-js/faker"

export const register = async (values: RegisterSchemaType) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password, name } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: "Email already in use!" }
  }

  await prisma.user.create({
    data: {
      image: faker.image.avatar(),
      name,
      email,
      hashedPassword,
    },
  })

  return { success: "Successfully registered" }
}