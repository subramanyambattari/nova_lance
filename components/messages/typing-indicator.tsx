import { motion } from "framer-motion"

export function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-blue-200">
      <span>{label}</span>
      <span className="flex gap-1">
        {[0, 1, 2].map((item) => (
          <motion.span
            key={item}
            className="size-1.5 rounded-full bg-blue-300"
            animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: item * 0.15 }}
          />
        ))}
      </span>
    </div>
  )
}
