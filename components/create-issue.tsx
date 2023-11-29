import { PaperClipIcon } from "@heroicons/react/24/outline";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { StopwatchIcon } from "@radix-ui/react-icons";
import { UserCircleIcon, TagIcon, PlusCircleIcon } from "lucide-react";
import { Fragment } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Form } from "./ui/form";
import { FancyMultiSelect } from "./fancy-multi-select";


const activity = [
	{
		id: 1,
		type: "comment",
		person: { name: "Eduardo Benz", href: "#" },
		imageUrl:
			"https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
		comment:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ",
		date: "6d ago",
	},
	{
		id: 2,
		type: "assignment",
		person: { name: "Hilary Mahy", href: "#" },
		assigned: { name: "Kristin Watson", href: "#" },
		date: "2d ago",
	},
	{
		id: 3,
		type: "tags",
		person: { name: "Hilary Mahy", href: "#" },
		tags: [
			{ name: "Bug", href: "#", color: "fill-red-500" },
			{ name: "Accessibility", href: "#", color: "fill-indigo-500" },
		],
		date: "6h ago",
	},
	{
		id: 4,
		type: "comment",
		person: { name: "Jason Meyers", href: "#" },
		imageUrl:
			"https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
		comment:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.",
		date: "2h ago",
	},
];


export default function CreateIssue() {
	return (
		<Sheet>
			<div className="flex space-x-2">
				<SheetTrigger asChild>
					<Button variant="default" size="sm">
						Create Issue
					</Button>
				</SheetTrigger>
				<SheetContent side="right" className="sm:max-w-xl sm:rounded-3xl">
					<div className="mx-auto max-w-full">
						<div className="mx-auto max-w-2xl items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none w-full">
							<div className="-mx-4 py-8 sm:mx-0 space-y-6 sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:pb-4 xl:pt-6 w-full">
								<div className="grid w-full items-center gap-1.5">
									<Label htmlFor="issue title">Issue Title</Label>
									<Input />
								</div>

								<div className="grid w-full items-center gap-1.5">
									<Label htmlFor="description">Description</Label>
									<Textarea placeholder="Type your message here." />
								</div>

								<div className="grid w-full items-center gap-1.5">
									<Label htmlFor="description">Tags</Label>
									<FancyMultiSelect />
								</div>

								<div className="grid gap-1.5 mt-6 ">
									<Label htmlFor="status">Status</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Select a status" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="apple">In Progress</SelectItem>
												<SelectItem value="banana">Done</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-1.5 mt-6 ">
									<Label htmlFor="priority">Priority</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Select a priority" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="high">High</SelectItem>
												<SelectItem value="medium">Medium</SelectItem>
												<SelectItem value="low">Low</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>

								<Button type="submit">Submit</Button>
							</div>
						</div>
					</div>
				</SheetContent>
			</div>
		</Sheet>
	);
}