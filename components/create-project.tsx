"use client"
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import createProject from "@/actions/formAction";
import { useRef, useState } from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import * as z from "zod";

const projectNameSchema = z.object({
	title: z.string().min(2, { message: "Project name is required."}).max(40),
});

type ProjectName = z.infer<typeof projectNameSchema>;

export function CreateProject() {
	const [open, setOpen] = useState(false);

	const form = useForm<ProjectName>({
		resolver: zodResolver(projectNameSchema),
		defaultValues: {
			title: "",
		},
	});

	// const handleSubmit = async (data: ProjectName) => {
	// 	const { title } = data;
	// 	const res = await createProject(title);
		// if (res) {
		// 	setOpen(false);
		// }
	// 	setOpen(false);
	// }

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Create Project</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<Form {...form}>
					<form 
						id="createProjectFormId" 
						action={async (formData: FormData) => {
							const valid = await form.trigger();
							if (!valid) return
							setOpen(false);
							return createProject(formData)
						}}
					// onSubmit={form.handleSubmit(handleSubmit)}
					>
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel htmlFor="project-name">Project Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
					</form>
				</Form>
				<DialogFooter>
						<Button type="submit" form="createProjectFormId" className="w-full">
							Create
						</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
