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
          "h-10 w-full appearance-none rounded-lg border border-zinc-200 bg-white px-3 py-2 pr-9 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-350 focus:bg-white focus-visible:border-blue-400/60 focus-visible:ring-3 focus-visible:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-700 dark:focus:bg-zinc-900 [&_option]:bg-white [&_option]:text-zinc-900 [&_option:checked]:bg-zinc-100 [&_option:hover]:bg-zinc-100 dark:[&_option]:bg-zinc-950 dark:[&_option]:text-white dark:[&_option:checked]:bg-zinc-800 dark:[&_option:hover]:bg-zinc-800",
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
