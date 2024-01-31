import {
  HelpCircle,
  Circle,
  ArrowUpCircle,
  CheckCircle2,
  XCircle,
  LucideIcon,
} from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
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
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormControl } from "@/components/ui/form"

export function StatusBox() {
  const { control, setValue } = useFormContext()

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

  interface Status {
    value: string
    label: string
    icon: LucideIcon
  }

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Status | null>({
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  })
  setValue("status", selected?.value)

  return (
    <FormField
      control={control}
      name="status"
      render={() => (
        <FormItem className="flex flex-col">
          <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  className="h-7 items-center justify-start text-xs"
                  size="sm"
                  variant="outline"
                >
                  {selected ? (
                    <>
                      <selected.icon className="mr-2 h-4 w-4 shrink-0" />
                      {selected.label}
                    </>
                  ) : (
                    <>Set status</>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0" side="bottom">
              <Command>
                <CommandInput placeholder="Change status..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {statuses.map((status) => (
                      <CommandItem
                        key={status.value}
                        onSelect={(value) => {
                          setSelected(
                            statuses.find((status) => status.value === value) ??
                              null,
                          )
                          setValue("status", status.value)
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
  )
}