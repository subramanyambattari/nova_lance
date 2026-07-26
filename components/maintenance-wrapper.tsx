"use client"

import { usePathname } from "next/navigation"
import { MaintenanceScreen } from "@/app/_components/maintenance-screen"

export function MaintenanceWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Allow access to auth routes even during maintenance
  if (pathname === "/login" || pathname === "/register" || pathname?.startsWith("/api/auth")) {
    return <>{children}</>
  }
  
  return <MaintenanceScreen />
}
