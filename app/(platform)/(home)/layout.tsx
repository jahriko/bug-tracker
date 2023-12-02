"use client"

import { Transition, Dialog } from "@headlessui/react";
import { useState, Fragment } from "react";
import {
	Bars3Icon,
	InboxIcon,
	XMarkIcon,
	PuzzlePieceIcon
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
	{ name: "All Issues", href: "/inbox", icon: InboxIcon, current: true },
	{ name: "Projects", href: "/projects", icon: PuzzlePieceIcon, current: false },
];

// const data = [
// 	{ id: 1, name: "Bug Tracker", href: "#", initial: "H", current: false },
// 	{ id: 2, name: "LMS", href: "#", initial: "T", current: false },
// 	{ id: 3, name: "Notion Clone", href: "#", initial: "W", current: false },
// ];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}


export default function ProjectIdLayout({ children }: { children: React.ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const path = usePathname();

	const { data: projects } = useQuery({
		queryKey: ["projects"],
		queryFn: async () => {
			const response = await fetch("/api/projects");
			const data = await response.json();

			return data;
		},
	})


	return (
		<>
			<div>
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-gray-900/80" />
						</Transition.Child>

						<div className="fixed inset-0 flex">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-300"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-300"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<div className="absolute left-full top-0 flex w-16 justify-center pt-5">
											<button
												type="button"
												className="-m-2.5 p-2.5"
												onClick={() => setSidebarOpen(false)}
											>
												<span className="sr-only">Close sidebar</span>
												<XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
											</button>
										</div>
									</Transition.Child>
									{/* Sidebar component, swap this element with another sidebar if you like */}
									<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
										<div className="flex h-16 shrink-0 items-center">
											<img
												className="h-8 w-auto"
												src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
												alt="Your Company"
											/>
										</div>
										<nav className="flex flex-1 flex-col">
											<ul role="list" className="flex flex-1 flex-col gap-y-7">
												<li>
													<ul role="list" className="-mx-2 space-y-1">
														{navigation.map((item: any) => (
															<li key={item.name}>
																<a
																	href={item.href}
																	className={classNames(
																		item.current
																			? "bg-gray-50 text-indigo-600"
																			: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
																		"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
																	)}
																>
																	<item.icon
																		className={classNames(
																			item.current
																				? "text-indigo-600"
																				: "text-gray-400 group-hover:text-indigo-600",
																			"h-6 w-6 shrink-0"
																		)}
																		aria-hidden="true"
																	/>
																	{item.name}
																</a>
															</li>
														))}
													</ul>
												</li>
												<li>
													<div className="text-xs font-semibold leading-6 text-gray-400">
														Projects
													</div>
													<ul role="list" className="-mx-2 mt-2 space-y-1">
														{projects?.map((project: any) => (
														<li key={project.id}>
															<a
																href={project.href}
																className={classNames(
																	project.current
																		? "bg-gray-50 text-indigo-600"
																		: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
																	"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
																)}
															>
																<span
																	className={classNames(
																		project.current
																			? "text-indigo-600 border-indigo-600"
																			: "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
																		"flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
																	)}
																>
																	{project.title.charAt(0)}
																</span>
																<span className="truncate">{project.title}</span>
															</a>
														</li>
														))}
													</ul>
												</li>
											</ul>
										</nav>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>

				{/* Static sidebar for desktop */}
				<div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col ">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
						<div className="flex h-16 shrink-0 items-center">
							<img
								className="h-8 w-auto"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
								alt="Your Company"
							/>
						</div>
						<nav className="flex flex-1 flex-col">
							<ul role="list" className="flex flex-1 flex-col gap-y-7">
								<li>
									<ul role="list" className="-mx-2 space-y-1">
										{navigation.map((item) => (
											<li key={item.name}>
												<Link
													href={item.href}
													className={classNames(
														path === item.href
															? "bg-gray-50 text-indigo-600"
															: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
														"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
													)}
												>
													<item.icon
														className={classNames(
															path === item.href
																? "text-indigo-600"
																: "text-gray-400 group-hover:text-indigo-600",
															"h-6 w-6 shrink-0"
														)}
														aria-hidden="true"
													/>
													{item.name}
												</Link>
											</li>
										))}
									</ul>
								</li>
								<li>
									<div className="text-xs font-semibold leading-6 text-gray-400">
										Projects
									</div>
									<ul role="list" className="-mx-2 mt-2 space-y-1">
										{projects?.map((project: any) => (
											<li key={project.id}>
												<Link
													href={`projects/${project.id}`}
													className={classNames(
														project.current
															? "bg-gray-50 text-indigo-600"
															: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
														"group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
													)}
												>
													<span
														className={classNames(
															project.current
																? "text-indigo-600 border-indigo-600"
																: "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
															"flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
														)}
													>
														{project.title.charAt(0)}
													</span>
													<span className="truncate">{project.title}</span>
												</Link>
											</li>
										))}
									</ul>
								</li>
							</ul>
						</nav>
					</div>
				</div>

				<div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden ">
					<button
						type="button"
						className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
						onClick={() => setSidebarOpen(true)}
					>
						<span className="sr-only">Open sidebar</span>
						<Bars3Icon className="h-6 w-6" aria-hidden="true" />
					</button>
					<div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
						Dashboard
					</div>
					<a href="#">
						<span className="sr-only">Your profile</span>
						<img
							className="h-8 w-8 rounded-full bg-gray-50"
							src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
					</a>
				</div>

				<main className="py-10 lg:pl-64 bg-white">
					<div className="px-4 sm:px-6 lg:px-8">{children}</div>
				</main>
			</div>
		</>
	);
}
