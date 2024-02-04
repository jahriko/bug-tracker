import { get } from "http"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "@/components/ui/command"
import { ProjectIdAndTitle } from "@/app/(platform)/(home)/layout"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormControl } from "@/components/ui/form"

export function ProjectBox({
  projects,
}: {
  projects: ProjectIdAndTitle[]
}) {
  const { control, setValue } = useFormContext()
  const [open, setOpen] = useState(false)

  setValue("projectId", projects[0]?.id)

  return (
    <FormField
      control={control}
      name="projectId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  className="p-0 h-auto"
                  variant="link"
                >
                  {field.value ? (
                    <>
                      <span className="mr-2 flex size-5 shrink-0 items-center justify-center rounded-lg border bg-gray-50 text-[0.625rem] font-medium">
                        {projects
                          .find((project) => project.id === field.value)
                          ?.title.charAt(0)
                          .toUpperCase()}
                      </span>

                      {
                        projects.find((project) => project.id === field.value)
                          ?.title
                      }
                    </>
                  ) : (
                    <>
                      <span className="mr-2 flex size-5 shrink-0 items-center justify-center rounded-lg border bg-gray-50 text-[0.625rem] font-medium">
                        {projects[0]?.title.charAt(0).toUpperCase()}
                      </span>
                      <span>{projects[0]?.title}</span>
                    </>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0" side="bottom">
              <Command>
                <CommandInput placeholder="Change priority..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {projects.map((project) => (
                      <CommandItem
                        key={project.id}
                        onSelect={() => {
                          setOpen(false)
                          setValue("projectId", project.id)
                        }}
                        value={project.title}
                      >
                        <span className="mr-2 flex size-5 shrink-0 items-center justify-center rounded-lg border bg-gray-50 text-[0.625rem] font-medium uppercase">
                          {projects[0]?.title.charAt(0)}
                        </span>
                        <span className="capitalize">{project.title}</span>
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
  )
}