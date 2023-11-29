import { promises as fs } from "fs";
import path from "path";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { taskSchema } from "./data/schema";
import { z } from "zod";

async function getTasks() {
	const data = await fs.readFile(
		path.join(process.cwd(), "app/(platform)/(home)/project/[projectId]/data/tasks.json")
	);

	const tasks = JSON.parse(data.toString());

	return z.array(taskSchema).parse(tasks);
}
 

export default async function ProjectId({ params }: { params: { projectId: string } }) {
	const tasks = await getTasks();

	return (
		<>
			<div className="py-10">
				<header>
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
							{params.projectId}
						</h1>
					</div>
				</header>
				<main>
					<div className="mx-auto lg:max-w-[1500px] sm:px-6 lg:px-8 max-w-full">
						<DataTable data={tasks} columns={columns} />
					</div>
				</main>
			</div>
		</>
	);
}
