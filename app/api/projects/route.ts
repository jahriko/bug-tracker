import { db } from "@/lib/prisma";

export async function GET() {
	try {
		const response = await db.project.findMany();
		return Response.json(response);
	} catch (error) {
		return { message: "can't fetch data" };
	}
}