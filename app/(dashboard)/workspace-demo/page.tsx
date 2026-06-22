import { WalletCard } from "@/components/workspace/wallet-card"
import { MilestonePipeline } from "@/components/workspace/milestone-pipeline"

export default function WorkspaceDemoPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Freelancer Workspace Demo
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Showcasing the new Escrow-Aware Wallet and Visual Milestone Delivery Pipeline.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          {/* Main Content Area */}
          <div className="space-y-12">
            <section>
              <MilestonePipeline />
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-12">
            <section>
              <WalletCard 
                available={2450.00} 
                escrow={1500.00} 
                pending={800.00} 
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
