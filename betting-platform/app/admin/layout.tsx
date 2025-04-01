"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Video, DollarSign, BarChart, Settings, LogOut, CreditCard, Ticket } from "lucide-react"
import { AdminNotification } from "@/components/admin-notification"

interface AdminData {
  username: string
  isAdmin: boolean
  lastLogin: string
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem("admin")
    if (adminData) {
      setAdmin(JSON.parse(adminData))
    } else {
      // Redirect to home if not logged in as admin
      router.push("/")
      toast({
        title: "Access denied",
        description: "You must be logged in as an admin to view this page.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }, [router, toast])

  const handleLogout = () => {
    localStorage.removeItem("admin")
    router.push("/")
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin dashboard.",
    })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!admin) {
    return null // Router will redirect
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="text-xl font-bold">JBA Admin</span>
          </Link>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">Logged in as</p>
          <p className="font-medium">{admin.username}</p>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/admin/transactions">
                <Button variant="ghost" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Transactions
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/admin/bets">
                <Button variant="ghost" className="w-full justify-start">
                  <Ticket className="mr-2 h-4 w-4" />
                  Bets
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/admin/betting">
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart className="mr-2 h-4 w-4" />
                  Betting Options
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/admin/live-video">
                <Button variant="ghost" className="w-full justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  Live Video
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/admin/currency">
                <Button variant="ghost" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Currency Settings
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/admin/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Site Settings
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-4 w-64 px-2">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <AdminNotification />
              <Link href="/" className="text-sm text-blue-600 hover:underline">
                View Site
              </Link>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

