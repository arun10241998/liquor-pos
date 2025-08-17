"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string
  redirectTo?: string
}

export function AuthGuard({ children, requiredRole = "admin", redirectTo = "/login" }: AuthGuardProps) {
  const { isAuthenticated, userRole, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && userRole !== requiredRole) {
        router.push("/")
        return
      }
    }
  }, [isAuthenticated, userRole, isLoading, router, requiredRole, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
