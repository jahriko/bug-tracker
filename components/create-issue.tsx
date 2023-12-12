import { Label } from "@radix-ui/react-label"
import { FancyMultiSelect } from "./fancy-multi-select"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "./ui/select"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Textarea } from "./ui/textarea"

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
	)
}
