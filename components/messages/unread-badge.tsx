export function UnreadBadge({ count }: { count: number }) {
  if (!count) return null

  return (
    <span className="grid min-w-5 place-items-center rounded-full bg-blue-500 px-1.5 py-0.5 text-[11px] font-semibold text-white">
      {count > 99 ? "99+" : count}
    </span>
  )
}
