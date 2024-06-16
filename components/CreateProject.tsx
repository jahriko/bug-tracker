"use client"
import { Button } from "@/components/catalyst/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ProjectSchema } from "@/lib/validations"
import { createProject } from "@/server/actions/create-project"
import { PlusIcon } from "@heroicons/react/20/solid"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function CreateProject() {
  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      title: "",
    },
  })

  async function onSubmit(data: ProjectSchema) {
    // console.log(data)
    const result = await createProject(data)

    if (result.code === "error") {
      return toast("Error creating project")
    }

    form.reset()

    return toast(result.message)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button outline>
          <PlusIcon /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Make changes r profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Form {...form}>
              <form id="create-project" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full"
                          placeholder="Project name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" form="create-project" type="submit">
              Create Project
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
