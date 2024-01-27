"use client"

import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  LucideIcon,
  XCircle,
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FormItem, Form, FormControl } from "@/components/ui/form"

interface Status {
  value: string
  label: string
  icon: LucideIcon
}
const statuses: Status[] = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: ArrowUpCircle,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle2,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: XCircle,
  },
]

const StatusSchema = z.object({
  status: z.string(),
})

export function StatusBox({
  status,
  issueId,
}: {
  status: string | undefined
  issueId: string
}) {
  const form = useForm<z.infer<typeof StatusSchema>>({
    resolver: zodResolver(StatusSchema),
  })

  const getIssueStatus = statuses.find((s) => s.value === status) ?? null

  async function onSubmit(data: z.infer<typeof StatusSchema>) {
    alert(data)

    // const result = await updateStatus(Number(issueId), currentValue)
    //
    // if (result.code === "error") {
    //   toast("Something went wrong", {
    //     description: result.message,
    //   })
    // }
    //
    // return toast("Changed status", {
    //   action: {
    //     label: "Undo",
    //     onClick: () => {
    //       console.log("Undo")
    //     },
    //   },
    // })
  }

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Status | null>(getIssueStatus)

  function StatusIcon({ status }: { status: string | undefined }) {
    if (status === "backlog") {
      return <HelpCircle className="mr-2 size-4" />
    } else if (status === "todo") {
      return <Circle className="mr-2 size-4" />
    } else if (status === "in progress") {
      return <ArrowUpCircle className="mr-2 size-4" />
    } else if (status === "done") {
      return <CheckCircle2 className="mr-2 size-4" />
    } else if (status === "canceled") {
      return <XCircle className="mr-2 size-4" />
    }
  }

  // const hasStatus = statuses.find((status) => status.value === status) ?? null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="status"
          render={() => (
            <FormItem>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className="-ml-2.5 w-[10rem] justify-start"
                      variant="ghost"
                    >
                      {selected ? (
                        <>
                          <StatusIcon status={selected.value} />
                          <span className="capitalize">{selected.label}</span>
                        </>
                      ) : status ? (
                        <>
                          <StatusIcon status={status} />
                          <span className="capitalize">{status}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 size-4" />
                          Add Status
                        </>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0" side="bottom">
                  <Command>
                    <CommandInput placeholder="Change status" />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {statuses.map((status) => (
                          <CommandItem
                            key={status.value}
                            onSelect={(currentValue) => {
                              // TODO: Fix this shit
                              setSelected(
                                statuses.find(
                                  (status) => status.value === currentValue,
                                ) ?? null,
                              )
                              form.setValue("status", status.value)
                              setOpen(false)
                            }}
                            value={status.value}
                          >
                            <status.icon
                              className={cn(
                                "mr-2 h-4 w-4",
                                status.value === selected?.value
                                  ? "opacity-100"
                                  : "opacity-40",
                              )}
                            />
                            <span>{status.label}</span>
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
