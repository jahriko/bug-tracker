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
			return (
				<>
					<Sheet>
						<div className="flex space-x-2">
							<SheetTrigger asChild>
								<div className="space-x-2">

									<span className="cursor-pointer max-w-3xl truncate font-medium hover:text-indigo-600">
										{row.getValue("title")}
									</span>
									<span className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
										{row.original.label?.charAt(0).toUpperCase() + row.original.label?.slice(1)}
									</span>
								</div>

							</SheetTrigger>
							<SheetContent side="right" className="h-full sm:max-w-xl">
								<div className="mx-auto max-w-full">
									<div className="mx-auto max-w-2xl items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none ">
										<div className="-mx-4 py-8 sm:mx-0 sm:px-8 sm:pb-14 xl:pb-4 xl:pt-6 space-y-4">

											<div>
												<span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200 mb-1.5">
													TASK-8782
												</span>
												<SheetTitle className="text-2xl font-medium">
													{row.getValue("title")}
												</SheetTitle>

												<div className="flex items-center mt-2 space-x-4">
													<div className="flex items-center text-muted-foreground">
														<UserCircleIcon className="mr-2 h-4 w-4" />
														<span className="text-sm font-medium mr-2">Eduardo Benz</span>
														<p className="text-sm ">opened this issue on November 12, 2023</p>

													</div>

												</div>


											</div>

											<Separator />

											<div className="flex justify-between">

												{/* Activity feed */}
												<div>
													<h2 className="text-sm font-semibold leading-6 text-gray-900">
														Status
													</h2>

													<div className="flex w-[100px] items-center">
														<StopwatchIcon className="mr-2 h-4 w-4 text-muted-foreground" />
														<span className="text-sm">In Progress</span>
													</div>
												</div>

												<div>
													<h2 className="text-sm font-semibold leading-6 text-gray-900">
														Priority
													</h2>

													<div className="flex w-[100px] items-center">
														<StopwatchIcon className="mr-2 h-4 w-4 text-muted-foreground" />
														<span className="text-sm">High</span>
													</div>
												</div>

												<div>
													<h2 className="text-sm font-semibold leading-6 text-gray-900">
														Assignee
													</h2>

													<div className="flex w-[100px] items-center">
														<StopwatchIcon className="mr-2 h-4 w-4 text-muted-foreground" />
														<span className="text-sm">High</span>
													</div>
												</div>





											</div>

											<Separator />


											<div>
												<div className="space-y-6 text-sm leading-6 text-gray-800">
													<p>
														Lorem ipsum dolor sit amet consectetur adipisicing
														elit. Nemo expedita voluptas culpa sapiente alias
														molestiae. Numquam corrupti in laborum sed rerum et
														corporis.
													</p>
												</div>
											</div>

										</div>
									</div>
								</div>
							</SheetContent>
						</div>
					</Sheet>
					<div className="text-gray-400 text-xs">{row.original.id}</div>
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
