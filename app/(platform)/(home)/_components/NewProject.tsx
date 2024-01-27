"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createProject } from "@/server/actions/project"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const projectNameSchema = z.object({
  title: z.string().min(2, { message: "Project name is required." }).max(40),
})

type ProjectName = z.infer<typeof projectNameSchema>

export function CreateProject() {
  const [open, setOpen] = useState(false)

  const form = useForm<ProjectName>({
    resolver: zodResolver(projectNameSchema),
    defaultValues: {
      title: "",
    },
  })

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="default">Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form
            action={async (formData: FormData) => {
              const valid = await form.trigger()
              if (!valid) return
              setOpen(false)
              return createProject(formData)
            }}
            id="createProjectFormId"
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
                )
              }}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button className="w-full" form="createProjectFormId" type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
