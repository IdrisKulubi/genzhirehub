"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Settings, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function UserMenu() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/landing" })
  }

  const handleProfileClick = () => {
    if (session?.user?.hasProfile && session?.user?.profileCompleted) {
      router.push("/onboarding/success")
    } else if (session?.user?.role === "student") {
      router.push("/onboarding/student-profile")
    } else if (session?.user?.role === "company") {
      router.push("/onboarding/company-profile")
    } else {
      router.push("/onboarding/role")
    }
  }

  const getUserInitials = (name?: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserDisplayName = () => {
    if (session?.user?.name) return session.user.name
    if (session?.user?.email) return session.user.email.split("@")[0]
    return "User"
  }

  const getUserRole = () => {
    if (!session?.user?.role) return "Getting started..."
    return session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)
  }

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button
            variant="outline"
            size="sm"
            className="border-rose-200 hover:border-rose-300 hover:bg-rose-50 dark:border-rose-800 dark:hover:border-rose-700 dark:hover:bg-rose-950/20 bg-transparent"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/login">
          <Button
            size="sm"
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0"
          >
            Get Started
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-auto p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={session.user.image || undefined} />
            <AvatarFallback className="bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300 text-sm font-semibold">
              {getUserInitials(session.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start text-left">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{getUserDisplayName()}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{getUserRole()}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            <p className="text-xs leading-none text-rose-600 dark:text-rose-400">{getUserRole()}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile & Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
