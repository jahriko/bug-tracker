import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { User } from "lucide-react"
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
import { Users } from "@/app/(platform)/(home)/layout"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../../components/ui/avatar"
import { Button } from "../../../../../components/ui/button"
import {
  FormField,
  FormItem,
  FormControl,
} from "../../../../../components/ui/form"

export default function AssigneeBox({ assignees }: { assignees: Users[] }) {
  const { control, setValue } = useFormContext()
  const [open, setOpen] = useState(false)

  return (
    <FormField
      control={control}
      name="assigneeId"
      render={({ field }) => {
        const getAssignee = assignees.find(
          (assignee) => assignee.id === field.value,
        )

        return (
          <FormItem className="flex flex-col">
            <Popover onOpenChange={setOpen} open={open}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    className="h-7 items-center justify-start text-xs"
                    size="sm"
                    variant="outline"
                  >
                    {field.value && getAssignee ? (
                      <>
                        <Avatar className="mr-1.5 h-4 w-4">
                          <AvatarImage src={getAssignee.image ?? undefined} />
                          <AvatarFallback>
                            {getAssignee.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {getAssignee.name}
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-4 w-4 shrink-0" />
                        Assignee
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
                      {assignees.map((assignee) => (
                        <CommandItem
                          key={assignee.id}
                          onSelect={() => {
                            setOpen(false)
                            setValue("assigneeId", assignee.id)
                          }}
                          value={assignee.id}
                        >
                          <Avatar className="mr-1.5 h-6 w-6">
                            <AvatarImage src={assignee.image ?? undefined} />
                            <AvatarFallback>
                              {assignee.name.charAt(0).toUpperCase()}
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
        )
      }}
    />
  )
}
