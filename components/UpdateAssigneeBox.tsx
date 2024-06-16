"use client"
import { UsersData } from "@/server/data/many/get-users"
import { useEffect, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { updateAssignee } from "@/server/actions/update-issue-assignee"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"

const AssigneeSchema = z.object({
  assigneeId: z.string(),
})

export function UpdateAssigneeBox({
  assignees,
  assigneeId,
  issueId,
}: {
  assignees: UsersData
  assigneeId: string | undefined
  issueId: string
}) {
  const [open, setOpen] = useState(false)
  const { handleSubmit, watch, ...form } = useForm<
    z.infer<typeof AssigneeSchema>
  >({ resolver: zodResolver(AssigneeSchema), mode: "onChange" })

  async function onSubmit(data: z.infer<typeof AssigneeSchema>) {
    const { assigneeId } = data

    const result = await updateAssignee(Number(issueId), assigneeId)

    if (result.code === "error") {
      toast("Something went wrong", {
        description: result.message,
      })
    }

    return toast("Changed assignee")
  }

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)())
    return () => {
      subscription.unsubscribe()
    }
  }, [handleSubmit, watch])

  const hasAssignee =
    assignees.find((assignee) => assignee.id === assigneeId) ?? undefined

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="assigneeId"
          render={({ field }) => (
            <FormItem>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    {hasAssignee ? (
                      <Button className="h-auto p-0" variant="link">
                        <Avatar className="mr-1.5 h-4 w-4">
                          <AvatarImage src={hasAssignee.image ?? undefined} />
                          <AvatarFallback>
                            {hasAssignee.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {hasAssignee.name}
                      </Button>
                    ) : (
                      <Button className="h-auto p-0" variant="link">
                        <User className="mr-1.5 h-4 w-4 shrink-0" />
                        Set Assignee
                      </Button>
                    )}
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0" side="bottom">
                  <Command>
                    <CommandInput placeholder="Change assignee" />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {assignees.map((assignee) => (
                          <CommandItem
                            key={assignee.id}
                            onSelect={() => {
                              field.onChange(assignee.id)
                              setOpen(false)
                            }}
                            value={assignee.id}
                          >
                            <Avatar className="mr-1.5 h-4 w-4">
                              <AvatarImage src={assignee.image ?? undefined} />
                              <AvatarFallback className="capitalize">
                                {assignee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{assignee.name}</span>
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
