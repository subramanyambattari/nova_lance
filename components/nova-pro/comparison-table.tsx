"use client"

import { Check, Minus } from "lucide-react"
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

const rows = [
  ["Applications per month", "10", "Unlimited", "Unlimited"],
  ["Analytics", "Basic", "Advanced", "Advanced + team"],
  ["AI tools", false, true, true],
  ["Profile visibility", "Standard", "Premium boost", "Agency boost"],
  ["Team access", false, false, true],
  ["Support", "Standard", "Priority", "Dedicated"],
  ["Payment speed", "Standard", "Faster payouts", "Custom terms"],
] as const

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="size-4 text-emerald-600 dark:text-emerald-300" />
    ) : (
      <Minus className="size-4 text-zinc-400 dark:text-zinc-650" />
    )
  }
  return <span>{value}</span>
}

export function ComparisonTable() {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.45 }}>
      <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Compare plans</CardTitle>
          <Badge variant="premium">Nova Pro advantage</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-200 dark:border-white/10 hover:bg-transparent">
                <TableHead>Category</TableHead>
                <TableHead>Free</TableHead>
                <TableHead>Nova Pro</TableHead>
                <TableHead>Enterprise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(([category, free, pro, enterprise]) => (
                <TableRow key={category} className="border-zinc-150 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/[0.03]">
                  <TableCell className="font-medium text-zinc-800 dark:text-zinc-100">{category}</TableCell>
                  <TableCell className="text-zinc-500 dark:text-zinc-400"><CellValue value={free} /></TableCell>
                  <TableCell className="text-blue-800 dark:text-blue-100 font-semibold"><CellValue value={pro} /></TableCell>
                  <TableCell className="text-zinc-600 dark:text-zinc-300"><CellValue value={enterprise} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.section>
  )
}
