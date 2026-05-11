import { cn } from "@/lib/utils"

export function OnlineStatus({
  online,
  className,
}: {
  online?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex size-2.5 rounded-full border border-zinc-950",
        online ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" : "bg-zinc-600",
        className
      )}
    />
  )
}
