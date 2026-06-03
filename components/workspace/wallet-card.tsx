"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, ShieldCheck, Clock, ArrowRightLeft } from "lucide-react"
import { AnimatedNumber } from "./animated-number"

interface WalletCardProps {
  available: number
  escrow: number
  pending: number
}

export function WalletCard({ available: initialAvailable, escrow: initialEscrow, pending: initialPending }: WalletCardProps) {
  const [available, setAvailable] = useState(initialAvailable)
  const [escrow, setEscrow] = useState(initialEscrow)
  const [pending, setPending] = useState(initialPending)

  // Demo function to simulate funds moving from escrow to available
  const releaseFunds = () => {
    if (escrow < 500) return
    setEscrow(prev => prev - 500)
    setAvailable(prev => prev + 500)
  }

  // Demo function to simulate a new milestone being funded
  const fundMilestone = () => {
    setEscrow(prev => prev + 1200)
  }

  return (
    <div className="w-full max-w-4xl rounded-2xl border border-zinc-200/60 bg-white/50 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Wallet className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Freelancer Wallet</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your earnings and escrow funds</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fundMilestone}
            className="flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            <ArrowRightLeft className="size-4" />
            Simulate Funding
          </button>
          <button 
            onClick={releaseFunds}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <ShieldCheck className="size-4" />
            Release $500
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Available Balance */}
        <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-950/50 dark:hover:border-blue-500/50">
          <div className="absolute -right-4 -top-4 size-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50 dark:bg-blue-900/20 dark:group-hover:bg-blue-800/30" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <Wallet className="size-4 text-blue-500" />
              Available to Withdraw
            </div>
            <div className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              <AnimatedNumber value={available} />
            </div>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Ready for transfer</p>
          </div>
        </div>

        {/* In Escrow */}
        <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-950/50 dark:hover:border-emerald-500/50">
          <div className="absolute -right-4 -top-4 size-24 rounded-full bg-emerald-100/50 blur-2xl transition-all group-hover:bg-emerald-200/50 dark:bg-emerald-900/20 dark:group-hover:bg-emerald-800/30" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <ShieldCheck className="size-4 text-emerald-500" />
              Locked in Escrow
            </div>
            <div className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              <AnimatedNumber value={escrow} />
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Secured for active milestones</p>
          </div>
        </div>

        {/* Pending Clearance */}
        <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-amber-300 hover:shadow-md dark:border-white/10 dark:bg-zinc-950/50 dark:hover:border-amber-500/50">
          <div className="absolute -right-4 -top-4 size-24 rounded-full bg-amber-100/50 blur-2xl transition-all group-hover:bg-amber-200/50 dark:bg-amber-900/20 dark:group-hover:bg-amber-800/30" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <Clock className="size-4 text-amber-500" />
              Pending Clearance
            </div>
            <div className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              <AnimatedNumber value={pending} />
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Clears in approx 5 days</p>
          </div>
        </div>
      </div>
    </div>
  )
}
