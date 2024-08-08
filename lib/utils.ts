import { DateTime } from "luxon"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export const convertHexToRGBA = (hex: string, opacity: number) => {
  let r = 0,
    g = 0,
    b = 0
  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  }
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16)
    g = parseInt(hex[3] + hex[4], 16)
    b = parseInt(hex[5] + hex[6], 16)
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export function darkenColor(hex, percent) {
  const amt = Math.floor((percent / 100) * 255)
  const color = hex.startsWith("#") ? hex.substring(1) : hex

  let [r, g, b] = color.match(/.{1,2}/g).map((x) => {
    const val = parseInt(x, 16) - amt
    return val < 0 ? 0 : val
  })

  r = (r < 255 ? r : 255).toString(16).padStart(2, "0")
  g = (g < 255 ? g : 255).toString(16).padStart(2, "0")
  b = (b < 255 ? b : 255).toString(16).padStart(2, "0")

  return `#${r}${g}${b}`
}

export function timeAgo(dateTime: DateTime) {
  const now = DateTime.now()
  const diffInSeconds = now.diff(dateTime, "seconds").seconds

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 120) {
    return "a minute ago"
  } else {
    return dateTime.toRelative(now)
  }
}
