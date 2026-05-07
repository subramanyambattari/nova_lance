"use client"

import { Camera, CheckCircle2, Upload } from "lucide-react"
import { motion } from "framer-motion"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ProfileHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
    >
      <Card className="relative overflow-hidden rounded-2xl border-white/10 bg-white/[0.045] p-px shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-violet-500/15 to-transparent" />
        <div className="relative rounded-2xl bg-zinc-950/80 p-5 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative w-fit">
                <Avatar className="size-24 border border-white/15 shadow-2xl shadow-blue-500/10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-3xl font-semibold text-white">
                    SR
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  aria-label="Edit avatar"
                  className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-blue-200 shadow-xl transition hover:bg-zinc-800"
                >
                  <Camera className="size-4" />
                </button>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-semibold text-white">Subbu Roy</h2>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    Online
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="premium">Full Stack Developer</Badge>
                  <Badge variant="success">
                    <CheckCircle2 className="mr-1 size-3" />
                    Top Rated Freelancer
                  </Badge>
                </div>
                <div className="mt-5 max-w-md">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Profile completion</span>
                    <span>85%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-blue-400 to-violet-400 shadow-[0_0_18px_rgba(96,165,250,0.55)]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08]"
              >
                <Upload className="size-4" />
                Upload profile image
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
