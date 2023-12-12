"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const schema = z.object({
	title: z.string().min(1).max(50)
})

export default async function createProject(formData: FormData) {
	const parse = schema.safeParse({
		title: formData.get("title")
	})

	if (!parse.success) {
		return { error: "Something went wrong.", project: null }
	}

	const data = parse.data

	try {
		const project = await db.project.create({
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
