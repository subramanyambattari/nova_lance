import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "h-10 w-full appearance-none rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 pr-9 text-sm text-white outline-none transition-colors focus:border-zinc-700 focus:bg-zinc-900 focus-visible:border-blue-400/60 focus-visible:ring-3 focus-visible:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-50 [&_option]:bg-zinc-900 [&_option]:text-white [&_option:checked]:bg-zinc-800 [&_option:hover]:bg-zinc-800",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
    </div>
  )
}

export { Select }
