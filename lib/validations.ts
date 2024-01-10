import { z } from "zod"

export const IssueSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }),
  description: z.string().min(1, { message: "Description cannot be empty" }),
  status: z.string(),
  priority: z.string(),
  assigneeId: z.string(),
  labels: z.array(
    z.object({ id: z.number(), name: z.string(), color: z.string() }),
  ),
  projectId: z.string(),
})

export type IssueSchema = z.infer<typeof IssueSchema>
