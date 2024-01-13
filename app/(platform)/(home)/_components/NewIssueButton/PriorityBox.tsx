import {
  MinusCircle,
  SignalLow,
  SignalMedium,
  SignalHigh,
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
import { Button } from "../../../../../components/ui/button"
import {
  FormField,
  FormItem,
  FormControl,
} from "../../../../../components/ui/form"

export default function PriorityBox() {
  const { setValue, control } = useFormContext()
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

  interface Priority {
    value: string
    label: string
    icon: LucideIcon
  }
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Priority | null>({
    value: "no priority",
    label: "No priority",
    icon: MinusCircle,
  })
  setValue("priority", selected?.value)
  return (
    <FormField
      control={control}
      name="priority"
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
                    <>
                      <selected.icon className="mr-2 h-4 w-4 shrink-0 text-gray-500" />
                      <span className="text-gray-500">Set Priority</span>
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
                    {priorities.map((priority) => (
                      <CommandItem
                        key={priority.value}
                        onSelect={(value) => {
                          setSelected(
                            priorities.find(
                              (priority) => priority.value === value,
                            ) ?? null,
                          )
                          setOpen(false)
                          setValue("priority", priority.value)
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
  )
}
