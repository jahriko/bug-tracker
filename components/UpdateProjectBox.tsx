"use client"
import { ProjectsData } from "@/server/data/many/get-projects"
import { useEffect, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { toast } from "sonner"
import { updateIssueProject } from "@/server/actions/update-issue-project"

const ProjectSchema = z.object({
  projectId: z.string(),
})

export function UpdateProjectBox({
  projects,
  projectId,
  issueId,
}: {
  projects: ProjectsData
  projectId: string
  issueId: string
}) {
  const [open, setOpen] = useState(false)
  const { handleSubmit, watch, ...form } = useForm<
    z.infer<typeof ProjectSchema>
  >({ resolver: zodResolver(ProjectSchema), mode: "onChange" })

  async function onSubmit(data: z.infer<typeof ProjectSchema>) {
    const { projectId } = data

    const result = await updateIssueProject(Number(issueId), projectId)

    if (result.code === "error") {
      toast("Something went wrong", {
        description: result.message,
      })
    }

    return toast("Changed project")
  }

  console.log("projectId", projectId)

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)())
    return () => {
      subscription.unsubscribe()
    }
  }, [handleSubmit, watch])

  const hasProject =
    projects.find((project) => project.id === projectId) ?? undefined

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="projectId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    {hasProject ? (
                      <div className="flex space-x-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-gray-50 text-[0.625rem] font-medium uppercase">
                          {hasProject.title.charAt(0)}
                        </span>
                        <Button className="h-auto p-0" variant="link">
                          <span>{hasProject.title}</span>
                        </Button>
                      </div>
                    ) : (
                      <Button className="h-auto p-0" variant="link">
                        <Plus className="mr-2 size-4" />
                        Set Project
                      </Button>
                    )}
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0" side="bottom">
                  <Command>
                    <CommandInput placeholder="Project name" />
                    <CommandList>
                      <CommandEmpty className="p-0 text-center">
                        <Button variant="ghost" className="w-full">
                          <Plus className="mr-2 size-4" />
                          Create project
                        </Button>
                      </CommandEmpty>
                      <CommandGroup>
                        {projects.map((project) => (
                          <CommandItem
                            key={project.id}
                            onSelect={() => {
                              field.onChange(project.id)
                              setOpen(false)
                            }}
                            value={project.id}
                          >
                            <span className="mr-2 flex size-5 shrink-0 items-center justify-center rounded-lg border bg-gray-50 text-[0.625rem] font-medium uppercase">
                              {projects[0]?.title.charAt(0)}
                            </span>
                            <span>{project.title}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}