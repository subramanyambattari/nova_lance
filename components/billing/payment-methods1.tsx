"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  BadgeCheck,
  CreditCard,
  Ellipsis,
  Landmark,
  Mail,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type PaymentType = "Visa" | "Mastercard" | "American Express" | "PayPal"

interface PaymentMethod {
  id: string
  type: PaymentType
  label: string
  detail: string
  expiry?: string
  default: boolean
}

const initialMethods: PaymentMethod[] = [
  {
    id: "visa-4242",
    type: "Visa",
    label: "Nova Lance Business",
    detail: "•••• 4242",
    expiry: "08/28",
    default: true,
  },
  {
    id: "mastercard-8891",
    type: "Mastercard",
    label: "Client expenses",
    detail: "•••• 8891",
    expiry: "11/27",
    default: false,
  },
  {
    id: "paypal-subbu",
    type: "PayPal",
    label: "PayPal",
    detail: "subbu@novalance.dev",
    default: false,
  },
]

const brandStyles: Record<PaymentType, string> = {
  Visa: "from-blue-500/40 to-cyan-400/10 text-blue-100",
  Mastercard: "from-orange-500/40 to-rose-500/10 text-orange-100",
  "American Express": "from-emerald-500/35 to-blue-500/10 text-emerald-100",
  PayPal: "from-sky-500/40 to-blue-600/10 text-sky-100",
}

function emptyDraft(): PaymentMethod {
  return {
    id: `method-${Date.now()}`,
    type: "Visa",
    label: "",
    detail: "",
    expiry: "",
    default: false,
  }
}

export function PaymentMethods1() {
  const [methods, setMethods] = useState(initialMethods)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<PaymentMethod>(emptyDraft)
  const editingExisting = useMemo(
    () => methods.some((method) => method.id === editingId),
    [editingId, methods]
  )

  function startAdd() {
    setDraft(emptyDraft())
    setEditingId("new")
  }

  function startEdit(method: PaymentMethod) {
    setDraft(method)
    setEditingId(method.id)
  }

  function saveDraft() {
    const normalizedDetail =
      draft.type === "PayPal"
        ? draft.detail || "billing@novalance.dev"
        : draft.detail.startsWith("••••")
          ? draft.detail
          : `•••• ${draft.detail.slice(-4) || "4242"}`

    const nextDraft = {
      ...draft,
      label: draft.label || `${draft.type} account`,
      detail: normalizedDetail,
      expiry: draft.type === "PayPal" ? undefined : draft.expiry || "12/29",
    }

    setMethods((current) => {
      const next = editingExisting
        ? current.map((method) =>
            method.id === editingId ? { ...nextDraft, id: method.id } : method
          )
        : [...current, nextDraft]

      return nextDraft.default
        ? next.map((method) => ({
            ...method,
            default: method.id === nextDraft.id,
          }))
        : next
    })
    setEditingId(null)
  }

  function setDefault(id: string) {
    setMethods((current) =>
      current.map((method) => ({ ...method, default: method.id === id }))
    )
  }

  function removeMethod(id: string) {
    setMethods((current) => {
      const next = current.filter((method) => method.id !== id)
      return next.some((method) => method.default) || next.length === 0
        ? next
        : next.map((method, index) => ({ ...method, default: index === 0 }))
    })
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base text-zinc-100">Payment methods</CardTitle>
          <p className="mt-2 text-sm text-zinc-500">
            Manage cards and payout billing sources for Nova Lance fees.
          </p>
        </div>
        <Button
          type="button"
          onClick={startAdd}
          className="rounded-xl bg-white text-zinc-950 hover:bg-blue-100"
        >
          <Plus className="size-4" />
          Add method
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {methods.map((method) => (
              <motion.div
                key={method.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="group rounded-2xl border border-white/10 bg-zinc-950/55 p-4 transition hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br",
                        brandStyles[method.type]
                      )}
                    >
                      {method.type === "PayPal" ? (
                        <Mail className="size-5" />
                      ) : (
                        <CreditCard className="size-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-zinc-100">{method.label}</p>
                        {method.default ? (
                          <Badge variant="success" className="gap-1">
                            <BadgeCheck className="size-3" />
                            Default
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">
                        {method.type} · {method.detail}
                        {method.expiry ? ` · Expires ${method.expiry}` : ""}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-xl text-zinc-400 hover:bg-white/[0.08]"
                      >
                        <Ellipsis className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-white/10 bg-zinc-950/95 text-zinc-100"
                    >
                      <DropdownMenuItem onClick={() => startEdit(method)}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDefault(method.id)}>
                        <BadgeCheck className="mr-2 size-4" />
                        Set as default
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-rose-300 hover:text-rose-200"
                        onClick={() => removeMethod(method.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950/55 p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-200">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h3 className="text-sm font-medium text-zinc-100">
                {editingId ? "Edit payment method" : "Secure billing vault"}
              </h3>
              <p className="text-xs text-zinc-500">
                Card details are represented as masked demo data.
              </p>
            </div>
          </div>

          {editingId ? (
            <div className="mt-5 grid gap-4">
              <div className="space-y-2">
                <Label>Payment type</Label>
                <Select
                  value={draft.type}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      type: event.target.value as PaymentType,
                    }))
                  }
                  className="border-white/10 bg-zinc-950/80 text-zinc-100"
                >
                  {(["Visa", "Mastercard", "American Express", "PayPal"] as PaymentType[]).map(
                    (type) => (
                      <option key={type} value={type} className="bg-zinc-950">
                        {type}
                      </option>
                    )
                  )}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={draft.label}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, label: event.target.value }))
                  }
                  placeholder="Business card"
                  className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{draft.type === "PayPal" ? "Email" : "Last four"}</Label>
                  <Input
                    value={draft.detail}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        detail: event.target.value,
                      }))
                    }
                    placeholder={draft.type === "PayPal" ? "you@example.com" : "4242"}
                    className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100"
                  />
                </div>
                {draft.type !== "PayPal" ? (
                  <div className="space-y-2">
                    <Label>Expiry</Label>
                    <Input
                      value={draft.expiry || ""}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          expiry: event.target.value,
                        }))
                      }
                      placeholder="12/29"
                      className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100"
                    />
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({ ...current, default: !current.default }))
                }
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left"
              >
                <span>
                  <span className="block text-sm font-medium text-zinc-100">
                    Set as default
                  </span>
                  <span className="text-xs text-zinc-500">
                    Use this method for subscription renewals.
                  </span>
                </span>
                <span
                  className={cn(
                    "size-5 rounded-full border transition",
                    draft.default
                      ? "border-blue-300 bg-blue-400 shadow-[0_0_16px_rgba(96,165,250,0.55)]"
                      : "border-white/20"
                  )}
                />
              </button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingId(null)}
                  className="flex-1 rounded-xl border-white/10 bg-white/[0.04] text-zinc-200"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={saveDraft}
                  className="flex-1 rounded-xl bg-white text-zinc-950 hover:bg-blue-100"
                >
                  Save method
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <Landmark className="size-4 text-violet-300" />
                <p className="mt-3 text-sm font-medium text-zinc-100">
                  Freelancer billing ready
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Keep a backup card for platform fees, featured proposals, and
                  Nova Pro renewals.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={startAdd}
                className="w-full rounded-xl border-white/10 bg-white/[0.04] text-zinc-200"
              >
                <Plus className="size-4" />
                Add another method
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
