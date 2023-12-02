"use client"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
const projects = [
	{
		title: "Bug Tracker",
		source:
			"https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
	},
	// More files...
];

export default function Projects() {

	const { data: projects } = useQuery({
		queryKey: ["projects"],
		queryFn: async () => {
			const response = await fetch("/api/projects");
			const data = await response.json();

			return data;
		},
	});
		
	return (
		<div>
			<Button variant="default" className="rounded-full">
				Create Project
			</Button>
			<Separator className="my-6" />
			<ul
				role="list"
				className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
			>
				{projects?.map((project) => (
					<li key={project.id} className="relative">
						<div className="group aspect-h-2 aspect-w-4 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
							<img
								src={"/visax-vw5WjLANvSQ-unsplash.jpg"}
								alt=""
								className="pointer-events-none object-cover"
							/>
						</div>
						<Link href="/">
							<p className="mt-2 block truncate text-sm font-medium text-gray-900 hover:text-indigo-700">
								{project.title}
							</p>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
