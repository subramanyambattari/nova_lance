import * as React from "react"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentProps<"div"> {
  value?: number
}

function Progress({ className, value = 0, ...props }: ProgressProps) {
  return (
    <div
      data-slot="progress"
      className={cn("h-2 w-full overflow-hidden rounded-full bg-white/10", className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400 transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

export { Progress }
