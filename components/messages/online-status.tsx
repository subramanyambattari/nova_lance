import { cn } from "@/lib/utils"

export function OnlineStatus({
  online,
  className,
}: {
  online?: boolean
  className?: string
}) {
  return (
    <div className={cn("relative flex size-2.5", className)}>
      {online && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
      )}
      <span
        className={cn(
          "relative inline-flex size-2.5 rounded-full border border-zinc-950 shrink-0",
          online ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-zinc-600"
        )}
      />
    </div>
  )
}
