"use client"

import { Star } from "lucide-react"
import { motion } from "framer-motion"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const testimonials = [
  {
    name: "Maya Chen",
    role: "Product Designer",
    lift: "+112% earnings",
    quote: "Nova Pro helped me double my freelance income in 3 months.",
  },
  {
    name: "Arjun Mehta",
    role: "Full Stack Engineer",
    lift: "+48% acceptance",
    quote: "The analytics finally showed which proposals were worth my time.",
  },
  {
    name: "Elena Ruiz",
    role: "Brand Strategist",
    lift: "3x profile views",
    quote: "Premium visibility changed the quality of clients reaching out.",
  },
]

export function Testimonials() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white sm:text-3xl">Built for high-performing freelancers</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
          >
            <Card className="h-full rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] p-5 shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
              <div className="flex gap-1 text-amber-500 dark:text-amber-300">
                {[0, 1, 2, 3, 4].map((star) => <Star key={star} className="size-4 fill-current" />)}
              </div>
              <p className="mt-5 text-base leading-7 text-zinc-700 dark:text-zinc-200">&quot;{item.quote}&quot;</p>
              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 border border-zinc-200 dark:border-white/10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-xs text-white">
                      {item.name.split(" ").map((part) => part[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.role}</p>
                  </div>
                </div>
                <Badge variant="success">{item.lift}</Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
