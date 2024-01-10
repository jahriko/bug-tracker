import { z } from "zod"

export const ProjectSchema = z.object({
  title: z.string().min(1).max(50),
})

export const RegisterSchema = z
  .object({
    email: z.string().min(1, "Email is required!").email("Invalid email!"),
    name: z.string().min(2, "Name is required!"),
    password: z
      .string()
      .min(1, "Password is required!")
      .min(8, "Password must have than 8 characters!"),
    confirmPassword: z.string().min(1, "Password confirmation is required!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match!",
  })

export type RegisterSchema = z.infer<typeof RegisterSchema>

export const LoginSchema = z.object({
  email: z.string().email("Invalid email!"),
  password: z
    .string()
    .min(1, "Password is required!")
    .min(8, "Password must have than 8 characters!"),
})

export type LoginSchema = z.infer<typeof LoginSchema>
