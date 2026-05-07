"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Switch({
  className,
  checked = false,
  onCheckedChange,
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className={cn(
        "inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-white/10 bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/30 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-violet-500",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className="pointer-events-none block size-5 translate-x-0.5 rounded-full bg-white shadow-lg transition-transform data-[state=checked]:translate-x-5"
      />
    </button>
  )
}

export { Switch }
