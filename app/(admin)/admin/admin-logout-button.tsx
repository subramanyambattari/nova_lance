"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function AdminLogoutButton() {
  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center justify-start gap-3 cursor-pointer"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut className="size-4" />
      Exit Admin
    </Button>
  )
}
