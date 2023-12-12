import { promises as fs } from "fs"
import path from "path"

import { z } from "zod"
import { columns } from "../_components/columns"
import { DataTable } from "../_components/data-table"
import { taskSchema } from "../_data/schema"

async function getTasks() {
	const data = await fs.readFile(
		path.join(process.cwd(), "app/(platform)/(home)/_data/tasks.json")
	)

	const tasks = JSON.parse(data.toString())

	return z.array(taskSchema).parse(tasks)
}

export default async function Inbox() {
	const tasks = await getTasks()

	return (
		<>
			<div className="py-6">
				<main>
					<div className="mx-auto lg:max-w-[1300px] sm:px-6 lg:px-8 max-w-full">
						<DataTable data={tasks} columns={columns} />
					</div>
				</main>
			</div>
		</>
	)
}
