"use client"

import { ColumnDef } from "@tanstack/react-table"
import { statuses } from "../_data/data"
import { Task } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"

import {
	PaperClipIcon,
	TagIcon,
	UserCircleIcon,
	XMarkIcon as XMarkIconMini
} from "@heroicons/react/20/solid"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { StopwatchIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Fragment } from "react"

const activity = [
	{
		id: 1,
		type: "comment",
		person: { name: "Eduardo Benz", href: "#" },
		imageUrl:
			"https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
		comment:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ",
		date: "6d ago"
	},
	{
		id: 2,
		type: "assignment",
		person: { name: "Hilary Mahy", href: "#" },
		assigned: { name: "Kristin Watson", href: "#" },
		date: "2d ago"
	},
	{
		id: 3,
		type: "tags",
		person: { name: "Hilary Mahy", href: "#" },
		tags: [
			{ name: "Bug", href: "#", color: "fill-red-500" },
			{ name: "Accessibility", href: "#", color: "fill-indigo-500" }
		],
		date: "6h ago"
	},
	{
		id: 4,
		type: "comment",
		person: { name: "Jason Meyers", href: "#" },
		imageUrl:
			"https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
		comment:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.",
		date: "2h ago"
	}
]

function classNames(...classes) {
	return classes.filter(Boolean).join(" ")
}

export const columns: ColumnDef<Task>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Title" />
		),
		cell: ({ row }) => {
			// const label = labels.find((label) => label.value === row.original.label)
			return (
				<>
					<Sheet>
						<div className="flex space-x-2">
							{/* {label && <Badge variant="outline">{label.label}</Badge>} */}
							<SheetTrigger asChild>
								<span className="cursor-pointer max-w-3xl truncate font-medium hover:text-indigo-600">
									{row.getValue("title")}
								</span>
							</SheetTrigger>
							<SheetContent side="right" className="h-full sm:max-w-6xl">
								<div className="mx-auto max-w-full">
									<div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
										<div className="-mx-4 py-8 sm:mx-0 sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:pb-4 xl:pt-6">
											<span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200 mb-1.5">
												TASK-8782
											</span>
											<SheetTitle className="text-2xl font-medium">
												{row.getValue("title")}
											</SheetTitle>
											<div>
												<div className="mt-4 space-y-6 text-sm leading-6 text-gray-800">
													<p>
														Lorem ipsum dolor sit amet consectetur adipisicing
														elit. Nemo expedita voluptas culpa sapiente alias
														molestiae. Numquam corrupti in laborum sed rerum et
														corporis.
													</p>
												</div>
											</div>

											<Separator className="my-10" />

											<div className="flow-root">
												<ul className="-mb-8">
													{activity.map((activityItem, activityItemIdx) => (
														<li key={activityItem.id}>
															<div className="relative pb-8">
																{activityItemIdx !== activity.length - 1 ? (
																	<span
																		className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
																		aria-hidden="true"
																	/>
																) : null}
																<div className="relative flex items-start space-x-3">
																	{activityItem.type === "comment" ? (
																		<>
																			<img
																				src={activityItem.imageUrl}
																				alt=""
																				className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
																			/>
																			<div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
																				<div className="flex justify-between gap-x-4">
																					<div className="py-0.5 text-xs leading-5 text-gray-500">
																						<span className="font-medium text-gray-900">
																							{activityItem.person.name}
																						</span>{" "}
																						commented
																					</div>
																					<time
																						dateTime={activityItem.dateTime}
																						className="flex-none py-0.5 text-xs leading-5 text-gray-500"
																					>
																						{activityItem.date}
																					</time>
																				</div>
																				<p className="text-sm leading-6 text-gray-500">
																					{activityItem.comment}
																				</p>
																			</div>
																		</>
																	) : // <>
																	// 	<div className="relative">
																	// 		<img
																	// 			className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
																	// 			src={activityItem.imageUrl}
																	// 			alt=""
																	// 		/>

																	// 		<span className="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
																	// 			<ChatBubbleLeftEllipsisIcon
																	// 				className="h-5 w-5 text-gray-400"
																	// 				aria-hidden="true"
																	// 			/>
																	// 		</span>
																	// 	</div>
																	// 	<div className="min-w-0 flex-1">
																	// 		<div>
																	// 			<div className="text-sm">
																	// 				<a
																	// 					href={activityItem.person.href}
																	// 					className="font-medium text-gray-900"
																	// 				>
																	// 					{activityItem.person.name}
																	// 				</a>
																	// 			</div>
																	// 			<p className="mt-0.5 text-sm text-gray-500">
																	// 				Commented {activityItem.date}
																	// 			</p>
																	// 		</div>
																	// 		<div className="mt-2 text-sm text-gray-700">
																	// 			<p>{activityItem.comment}</p>
																	// 		</div>
																	// 	</div>
																	// </>
																	activityItem.type === "assignment" ? (
																		<>
																			<div>
																				<div className="relative px-1">
																					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
																						<UserCircleIcon
																							className="h-5 w-5 text-gray-500"
																							aria-hidden="true"
																						/>
																					</div>
																				</div>
																			</div>
																			<div className="min-w-0 flex-1 py-1.5">
																				<div className="text-sm text-gray-500">
																					<a
																						href={activityItem.person.href}
																						className="font-medium text-gray-900"
																					>
																						{activityItem.person.name}
																					</a>{" "}
																					assigned{" "}
																					<a
																						href={activityItem.assigned.href}
																						className="font-medium text-gray-900"
																					>
																						{activityItem.assigned.name}
																					</a>{" "}
																					<span className="whitespace-nowrap">
																						{activityItem.date}
																					</span>
																				</div>
																			</div>
																		</>
																	) : activityItem.type === "tags" ? (
																		<>
																			<div>
																				<div className="relative px-1">
																					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
																						<TagIcon
																							className="h-5 w-5 text-gray-500"
																							aria-hidden="true"
																						/>
																					</div>
																				</div>
																			</div>
																			<div className="min-w-0 flex-1 py-0">
																				<div className="text-sm leading-8 text-gray-500">
																					<span className="mr-0.5">
																						<a
																							href={activityItem.person.href}
																							className="font-medium text-gray-900"
																						>
																							{activityItem.person.name}
																						</a>{" "}
																						added tags
																					</span>{" "}
																					<span className="mr-0.5">
																						{activityItem.tags.map((tag) => (
																							<Fragment key={tag.name}>
																								<a
																									href={tag.href}
																									className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200"
																								>
																									<svg
																										className={classNames(
																											tag.color,
																											"h-1.5 w-1.5"
																										)}
																										viewBox="0 0 6 6"
																										aria-hidden="true"
																									>
																										<circle
																											cx={3}
																											cy={3}
																											r={3}
																										/>
																									</svg>
																									{tag.name}
																								</a>{" "}
																							</Fragment>
																						))}
																					</span>
																					<span className="whitespace-nowrap">
																						{activityItem.date}
																					</span>
																				</div>
																			</div>
																		</>
																	) : null}
																</div>
															</div>
														</li>
													))}
												</ul>
											</div>

											<div className="flex items-start space-x-4 mt-6">
												<div className="flex-shrink-0">
													<img
														className="inline-block h-10 w-10 rounded-full"
														src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
														alt=""
													/>
												</div>
												<div className="min-w-0 flex-1">
													<form action="#" className="relative">
														<div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
															<Textarea placeholder="Type your message here." />
														</div>

														<div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
															<div className="flex items-center space-x-5">
																<div className="flex items-center">
																	<button
																		type="button"
																		className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
																	>
																		<PaperClipIcon
																			className="h-5 w-5"
																			aria-hidden="true"
																		/>
																		<span className="sr-only">
																			Attach a file
																		</span>
																	</button>
																</div>
																<div className="flex items-center" />
															</div>
															<div className="flex-shrink-0">
																<Button
																	type="submit"
																	className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
																>
																	Post
																</Button>
															</div>
														</div>
													</form>
												</div>
											</div>
										</div>

										<div className="lg:col-start-3">
											{/* Activity feed */}
											<h2 className="text-sm font-semibold leading-6 text-gray-900">
												Status
											</h2>

											<div className="flex w-[100px] items-center">
												<StopwatchIcon className="mr-2 h-4 w-4 text-muted-foreground" />
												<span className="text-sm">In Progress</span>
											</div>
										</div>
									</div>
								</div>
							</SheetContent>
						</div>
					</Sheet>
					<div className="text-gray-400 text-sm">{row.original.id}</div>
				</>
			)
		}
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => {
			const status = statuses.find(
				(status) => status.value === row.getValue("status")
			)

			if (!status) {
				return null
			}

			return (
				<div className="flex w-[100px] items-center">
					{status.icon && (
						<status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
					)}
					<span>{status.label}</span>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		}
	}
]
