"use client"

import { Paintbrush } from "lucide-react"
import { useState } from "react"
import Circle from "@uiw/react-color-circle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function Picker({
  background,
  setBackground,
  className,
}: {
  background: string
  setBackground: (background: string) => void
  className?: string
}) {
  const [hex, setHex] = useState(undefined)
  const solids = [
    "#E2E2E2",
    "#ff75c3",
    "#ffa647",
    "#ffe83f",
    "#9fff5b",
    "#70e2ff",
    "#cd93ff",
    "#09203f",
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-[220px] justify-start text-left font-normal",
            !hex && "text-muted-foreground",
            className,
          )}
          variant="outline"
        >
          <div className="flex w-full items-center gap-2">
            {hex ? (
              <div
                className="h-4 w-4 rounded !bg-cover !bg-center transition-all"
                style={{ background: hex }}
              />
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="flex-1 truncate">"Pick a color"</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="mt-0 flex w-full flex-wrap gap-1">
          <Circle
            color={hex}
            colors={solids}
            onChange={(color) => {
              setHex(color.hex)
            }}
          />
          {/* {solids.map((s) => (
            <CirclePicker color={s} />

            // <div
            //   className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
            //   key={s}
            //   onClick={() => {
            //     setBackground(s)
            //   }}
            //   style={{ background: s }}
            // />
          ))} */}
        </div>

        <Input
          className="col-span-2 mt-4 h-8"
          id="custom"
          onChange={(e) => {
            setBackground(e.currentTarget.value)
          }}
          value={background}
        />
      </PopoverContent>
    </Popover>
  )
}

const GradientButton = ({
  background,
  children,
}: {
  background: string
  children: React.ReactNode
}) => {
  return (
    <div
      className="relative rounded-md !bg-cover !bg-center p-0.5 transition-all"
      style={{ background }}
    >
      <div className="rounded-md bg-popover/80 p-1 text-center text-xs">
        {children}
      </div>
    </div>
  )
}
