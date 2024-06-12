import { columns } from "@/components/DataTable/columns"
import { DataTable } from "@/components/DataTable/data-table"
import prisma from "@/lib/prisma"
import { getIssuesById } from "@/server/data/many/get-issues-by-id"
import { getLabels } from "@/server/data/many/get-labels"
import { getUsers } from "@/server/data/many/get-users"
import { notFound } from "next/navigation"
import NewIssueDialog from "./new-issue-dialog"

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
	const decodedProjectParams = decodeURIComponent(params.projectId)
	const issues = await getIssuesById(decodedProjectParams)
	const assignees = await getUsers()
	const labels = await getLabels()

	// Check if project exists
	try {
		await prisma.project.findFirstOrThrow({
			where: {
				title: params.projectId,
			},
		})
	} catch (error: unknown) {
		notFound()
	}

	return (
		<div className="py-6">
			<main className="container">
				<div>
					<div className="flex items-center gap-x-6 ">
						{/* <Input className="h-8" /> */}
						<NewIssueDialog assignees={assignees} labels={labels} />
						{/* <NewIssueButton /> */}
					</div>
					<DataTable columns={columns} data={issues} />
				</div>
			</main>
		</div>
	)
}
