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

export function CurrentWork() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }}>
      <Card className="rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-100">Current work</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead>Project</TableHead>
                <TableHead className="hidden sm:table-cell">Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Deadline</TableHead>
                <TableHead className="min-w-36">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.name} className="border-white/10 hover:bg-white/[0.03]">
                  <TableCell className="font-medium text-zinc-100">{project.name}</TableCell>
                  <TableCell className="hidden text-zinc-400 sm:table-cell">{project.client}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-400/20 bg-blue-500/10 text-blue-200">
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-zinc-400 md:table-cell">{project.deadline}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-xs text-zinc-500">{project.progress}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
