import { Priority, Status } from "@prisma/client"
import { z } from "zod"

export const IssueSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }),
  description: z.string(),
  status: z.nativeEnum(Status),
  priority: z.nativeEnum(Priority),
  assigneeId: z.string().optional(),
  labels: z.array(z.object({ id: z.number(), name: z.string(), color: z.string() })),
  projectId: z.number(),
})

export type IssueSchema = z.infer<typeof IssueSchema>

export const ProjectSchema = z.object({
  workspaceId: z.number(),
  title: z.string().min(1).max(50),
})

export type ProjectSchema = z.infer<typeof ProjectSchema>

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
  email: z.string().email("Email is required"),
  password: z.string().min(1, "Password is required"),
})

export type LoginSchema = z.infer<typeof LoginSchema>

export const WorkspaceSchema = z.object({
  name: z.string().min(2, { message: "Workspace name is required." }),
})

export type WorkspaceSchema = z.infer<typeof WorkspaceSchema>
