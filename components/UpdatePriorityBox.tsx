"use client"
import { useEffect, useState } from "react"
import {
  LucideIcon,
  MinusCircle,
  SignalHigh,
  SignalLow,
  SignalMedium,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { FormControl, FormField, FormItem, Form } from "@/components/ui/form"
import { updatePriority } from "@/server/actions/update-issue-priority"
import { PriorityData } from "@/server/data/get-priority"

interface Priority {
  value: string
  label: string
  icon: LucideIcon
}

const priorities = [
  {
    value: "no priority",
    label: "No priority",
    icon: MinusCircle,
  },
  {
    value: "low",
    label: "Low",
    icon: SignalLow,
  },
  {
    value: "medium",
    label: "Medium",
    icon: SignalMedium,
  },
  {
    value: "high",
    label: "High",
    icon: SignalHigh,
  },
]

const PrioritySchema = z.object({
  priority: z.string(),
})

export function UpdatePriorityBox({
  priority,
  issueId,
}: {
  priority: PriorityData
  issueId: string
}) {
  const { handleSubmit, watch, ...form } = useForm<
    z.infer<typeof PrioritySchema>
  >({
    resolver: zodResolver(PrioritySchema),
    mode: "onChange",
  })

  async function onSubmit(data: z.infer<typeof PrioritySchema>) {
    const { priority } = data

    const result = await updatePriority(Number(issueId), priority)

    if (result.code === "error") {
      toast("Something went wrong", {
        description: result.message,
      })
    }

    return toast("Changed priority")
  }

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)())
    return () => {
      subscription.unsubscribe()
    }
  }, [handleSubmit, watch])

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Priority | null>({
    value: "no priority",
    label: "No priority",
    icon: MinusCircle,
  })

  function PriorityIcon({ priority }: { priority: string | undefined }) {
    if (priority === "no priority") {
      return <MinusCircle className="mr-2 size-4" />
    } else if (priority === "low") {
      return <SignalLow className="mr-2 size-4" />
    } else if (priority === "medium") {
      return <SignalMedium className="mr-2 size-4" />
    } else if (priority === "high") {
      return <SignalHigh className="mr-2 size-4" />
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button className="h-auto p-0" variant="link">
                      <PriorityIcon priority={priority} />
                      <span className="capitalize">
                        {priority ?? "No priority"}
                      </span>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0" side="bottom">
                  <Command>
                    <CommandInput placeholder="Change priority" />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {priorities.map((priority) => (
                          <CommandItem
                            key={priority.value}
                            onSelect={() => {
                              field.onChange(priority.value)
                              setOpen(false)
                            }}
                            value={priority.value}
                          >
                            <priority.icon
                              className={cn(
                                "mr-2 h-4 w-4",
                                priority.value === selected?.value
                                  ? "opacity-100"
                                  : "opacity-40",
                              )}
                            />
                            <span>{priority.label}</span>
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