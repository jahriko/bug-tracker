"use client"
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  LucideIcon,
  Plus,
  XCircle,
} from "lucide-react"
import { z } from "zod"
import {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { BaseSyntheticEvent, useEffect, useState } from "react"
import { updateStatus } from "@/server/actions/update-issue-status"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { StatusData } from "@/server/data/get-status";

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

export function UpdateStatusBox({
  status,
  issueId,
}: {
  status: StatusData
  issueId: string
}) {
  const { handleSubmit, watch, ...form } = useForm<
    z.infer<typeof StatusSchema>
  >({
    resolver: zodResolver(StatusSchema),
    mode: "onChange",
  })

  const getIssueStatus = statuses.find((s) => s.value === status) ?? null

  async function onSubmit(data: z.infer<typeof StatusSchema>) {
    const { status } = data

    const result = await updateStatus(Number(issueId), status)

    if (result.code === "error") {
      toast("Something went wrong", {
        description: result.message,
      })
    }

    return toast("Changed status", {
      action: {
        label: "Undo",
        onClick: () => {
          console.log("Undo")
        },
      },
    })
  }

  // https://stackoverflow.com/questions/63466463/how-to-submit-react-form-fields-on-onchange-rather-than-on-submit-using-react-ho
  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)())
    return () => {
      subscription.unsubscribe()
    }
  }, [handleSubmit, watch])

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

  return (
    <Form {...form} key="status-update-form">
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.error(errors)
        })}
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      className="-ml-2.5 w-[10rem] justify-start"
                      variant="ghost"
                    >
                      {status ? (
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
                      <CommandGroup>
                        {statuses.map((status) => (
                          <CommandItem
                            key={status.value}
                            onSelect={() => {
                              field.onChange(status.value)
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