"use client"

import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Project {
  name: string
  client: string
  status: "In review" | "Active" | "Design sprint"
  deadline: string
  progress: number
}

const projects: Project[] = [
  {
    name: "Mobile App Audit",
    client: "Northstar Labs",
    status: "In review",
    deadline: "May 14",
    progress: 82,
  },
  {
    name: "SaaS Landing Page",
    client: "Relay Cloud",
    status: "Active",
    deadline: "May 18",
    progress: 64,
  },
  {
    name: "Analytics Dashboard",
    client: "FinOps Studio",
    status: "Design sprint",
    deadline: "May 22",
    progress: 41,
  },
]

export function CurrentWork({ initialActiveJobs = [] }: { initialActiveJobs?: any[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }}>
      <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Current work</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-200 hover:bg-transparent dark:border-white/10">
                <TableHead>Project</TableHead>
                <TableHead className="hidden sm:table-cell">Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Deadline</TableHead>
                <TableHead className="min-w-36">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialActiveJobs.length > 0 ? initialActiveJobs.map((project) => (
                <TableRow key={project.id} className="border-zinc-200 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/[0.03]">
                  <TableCell className="font-medium text-zinc-950 dark:text-zinc-100">{project.title}</TableCell>
                  <TableCell className="hidden text-zinc-600 dark:text-zinc-400 sm:table-cell">{project.client?.name || "Client"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-400/20 bg-blue-500/10 text-blue-200">
                      {project.status || "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-zinc-600 dark:text-zinc-400 md:table-cell">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : "TBD"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-xs text-zinc-500">{project.progress}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-zinc-500 py-6">No active work right now. Apply to some jobs!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
