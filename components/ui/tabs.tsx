"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Tabs({ ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-950/80 p-1 text-zinc-400 shadow-inner shadow-black/20",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-lg border border-transparent px-3 text-sm font-medium whitespace-nowrap text-zinc-400 transition-all hover:text-white data-[state=active]:border-blue-300/30 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-blue-950/40",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
