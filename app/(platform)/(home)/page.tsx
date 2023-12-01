import { promises as fs } from "fs";
import path from "path";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { taskSchema } from "./data/schema";
import { z } from "zod";

async function getTasks() {
	const data = await fs.readFile(
		path.join(process.cwd(), "app/(platform)/(home)/data/tasks.json")
	);

	const tasks = JSON.parse(data.toString());

	return z.array(taskSchema).parse(tasks);
}
 

export default async function ProjectId() {
	const tasks = await getTasks();

	return (
		<>
			<div className="py-6">
				<main>
					<div className="mx-auto lg:max-w-[1500px] sm:px-6 lg:px-8 max-w-full">
						<DataTable data={tasks} columns={columns} />
					</div>
				</main>
			</div>
		</>
	);
}
