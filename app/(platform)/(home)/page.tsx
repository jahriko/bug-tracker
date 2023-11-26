import { CreateProject } from "@/components/create-project";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import db from "@/lib/prisma";

// const projects = [
// 	{ id: 1, name: "Graph API", initials: "GA", members: 16, bgColor: "bg-pink-600" },
// 	{
//     id: 2,
// 		name: "Component Design",
// 		initials: "CD",
// 		members: 12,
// 		bgColor: "bg-purple-600",
// 	},
// 	{ id: 3, name: "Templates", initials: "T", members: 16, bgColor: "bg-yellow-500" },
// 	{
//     id: 4,
// 		name: "React Components",
// 		initials: "RC",
// 		members: 8,
// 		bgColor: "bg-green-500",
// 	},
// ];

export default async function Home() {

  const projects = await db.project.findMany();

	return (
		<div>
			<div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
				<div className="flex justify-between items-center mb-3">
					<h2 className="text-lg font-medium text-gray-500">Your Projects</h2>
          <CreateProject/>
				</div>
				<div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
					{projects.map((project) => (
						<Link
							className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-slate-900 dark:border-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
							href={`/project/${project.id}`}
							key={project.title}
						>
							<div className="p-4 md:p-6">
								<div className="flex justify-between items-center">
									<div>
										<h3 className="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-gray-400 dark:text-gray-200">
											{project.title}
										</h3>
										<p className="text-sm text-gray-500">4 issues</p>
									</div>
									<div className="ps-3">
										<svg
											className="flex-shrink-0 w-5 h-5"
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="m9 18 6-6-6-6" />
										</svg>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
