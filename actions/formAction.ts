"use server"

import db from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export default async function createProject(formData: FormData) {
	const title = formData.get('title')

	const project = await db.project.create({
		data: {
			title: title as string,
		},
	});

	if (!project) {
		return { error: "Something went wrong.", project: null }
	}

	revalidatePath('/')
}