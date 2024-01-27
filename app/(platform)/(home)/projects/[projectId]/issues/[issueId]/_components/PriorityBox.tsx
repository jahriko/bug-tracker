"use client"

import { useState } from "react";
import { MinusCircle, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

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

export function PriorityBox({ priority }: { priority: string }) {
  const [selected, setSelected] = useState<Status | null>({
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
    <Popover>
      <PopoverTrigger asChild>
        <Button className="-ml-2.5 w-[10rem] justify-start" variant="ghost">
          <PriorityIcon priority={priority} />
          <span className="capitalize">{priority || "No priority"}</span>
        </Button>
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
                  onSelect={(value) => {
                    setSelected(
                      priorities.find((priority) => priority.value === value) ??
                      null,
                    )
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
  )
}