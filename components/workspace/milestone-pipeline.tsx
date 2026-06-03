"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, Loader2, UploadCloud, FileText, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// Types
type MilestoneStatus = "PENDING" | "IN_PROGRESS" | "IN_REVIEW" | "APPROVED"

interface Milestone {
  id: string
  title: string
  amount: number
  status: MilestoneStatus
}

// Initial Mock Data
const initialMilestones: Milestone[] = [
  { id: "m1", title: "Project Setup & Discovery", amount: 500, status: "APPROVED" },
  { id: "m2", title: "Frontend Architecture", amount: 1200, status: "IN_PROGRESS" },
  { id: "m3", title: "Backend API Integration", amount: 800, status: "PENDING" },
  { id: "m4", title: "Final Polish & Handoff", amount: 300, status: "PENDING" },
]

export function MilestonePipeline() {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)
  const [isDragging, setIsDragging] = useState(false)

  // Handlers for drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      submitDeliverable(id)
    }
  }

  // Simulate submitting a deliverable (Optimistic UI)
  const submitDeliverable = (id: string) => {
    setMilestones(current => 
      current.map(m => m.id === id ? { ...m, status: "IN_REVIEW" } : m)
    )

    // Simulate backend approval after 3 seconds
    setTimeout(() => {
      setMilestones(current => 
        current.map(m => m.id === id ? { ...m, status: "APPROVED" } : m)
      )
      
      // Auto start next pending milestone
      setMilestones(current => {
        const nextPendingIndex = current.findIndex(m => m.status === "PENDING")
        if (nextPendingIndex !== -1) {
          const updated = [...current]
          updated[nextPendingIndex] = { ...updated[nextPendingIndex], status: "IN_PROGRESS" }
          return updated
        }
        return current
      })
    }, 3000)
  }

  return (
    <div className="w-full max-w-4xl rounded-2xl border border-zinc-200/60 bg-white/50 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
      <div className="mb-8">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Milestone Delivery Pipeline</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Track progress and upload deliverables for review</p>
      </div>

      <div className="relative pl-4">
        {/* Continuous vertical line connecting all nodes */}
        <div className="absolute bottom-6 left-[27px] top-6 w-0.5 bg-zinc-200 dark:bg-zinc-800" />

        <div className="flex flex-col gap-8">
          {milestones.map((milestone, index) => {
            const isLast = index === milestones.length - 1
            const isCompleted = milestone.status === "APPROVED"
            const isActive = milestone.status === "IN_PROGRESS" || milestone.status === "IN_REVIEW"
            const isReview = milestone.status === "IN_REVIEW"

            return (
              <div key={milestone.id} className="relative flex items-start gap-6">
                {/* Node Status Icon */}
                <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-white dark:bg-zinc-950">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                    >
                      <Check className="size-4" strokeWidth={3} />
                    </motion.div>
                  ) : isReview ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="flex size-7 items-center justify-center text-blue-500"
                    >
                      <Loader2 className="size-5" />
                    </motion.div>
                  ) : isActive ? (
                    <div className="flex size-7 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/20">
                      <div className="size-2.5 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="flex size-7 items-center justify-center rounded-full border-2 border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900" />
                  )}
                </div>

                {/* Milestone Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className={cn("text-base font-medium transition-colors", 
                      isCompleted ? "text-zinc-500 line-through dark:text-zinc-500" : 
                      isActive ? "text-zinc-900 dark:text-zinc-100" : 
                      "text-zinc-500 dark:text-zinc-400"
                    )}>
                      {milestone.title}
                    </h3>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      ${milestone.amount}
                    </span>
                  </div>

                  {/* Dynamic State Content */}
                  <AnimatePresence mode="popLayout">
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="mt-4 overflow-hidden"
                      >
                        {isReview ? (
                          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                            <FileText className="size-5 text-blue-500" />
                            <div className="text-sm">
                              <p className="font-medium text-blue-900 dark:text-blue-100">Deliverable in review</p>
                              <p className="text-blue-700 dark:text-blue-300">Client has been notified and is reviewing the files.</p>
                            </div>
                          </div>
                        ) : (
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, milestone.id)}
                            className={cn(
                              "relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-all",
                              isDragging 
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" 
                                : "border-zinc-200 bg-zinc-50 hover:border-blue-400 hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-blue-500/50 dark:hover:bg-zinc-800/50"
                            )}
                          >
                            <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                              <UploadCloud className="size-6" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Click to upload or drag and drop
                              </p>
                              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                ZIP, PDF, or image files (max 50MB)
                              </p>
                            </div>
                            {/* Fake hidden input for accessibility/clicks if needed later */}
                            <input type="file" className="absolute inset-0 cursor-pointer opacity-0" onChange={(e) => {
                              if (e.target.files?.length) submitDeliverable(milestone.id)
                            }} />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
