"use client"

import Link from "next/link"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMemo } from "react"

const profileEmojis = ["👤", "👩", "👨", "🧑", "🤖", "👻", "🦊", "🐱", "🐰", "🦁", "🐯", "🐺"]

const getNavigationItems = (isAuthenticated: boolean) => {
  if (!isAuthenticated) return []
  
  return [
    {
      title: "Dashboard",
      href: "/u/dashboard"
    },
    {
      title: "Settings",
      href: "/u/settings"
    }
  ]
}

const getUserMenuItems = (onSignOut: () => void) => [
  {
    title: "Logout",
    onClick: onSignOut
  }
]

export default function Header() {
    const session = useSession();
    const isAuthenticated = session.status === "authenticated"
    
    const profileEmoji = useMemo(() => {
      return profileEmojis[Math.floor(Math.random() * profileEmojis.length)]
    }, [session.data?.user?.email])

    const navigationItems = getNavigationItems(isAuthenticated)
    const userMenuItems = getUserMenuItems(() => signOut({ callbackUrl: '/' }))
    
    return (
        <header className="border-b border-gray-800/40 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/50">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href={isAuthenticated ? "/u/dashboard" : "/"} className="flex items-center gap-3">
                        <span className="font-geist-sans text-2xl font-bold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                            Rumros
                        </span>
                    </Link>
                    {isAuthenticated && (
                      <NavigationMenu>
                          <NavigationMenuList className="gap-1">
                              {navigationItems.map((item) => (
                                  <NavigationMenuItem key={item.title}>
                                      <Link href={item.href} legacyBehavior passHref>
                                          <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-800/50 hover:text-white">
                                              {item.title}
                                          </NavigationMenuLink>
                                      </Link>
                                  </NavigationMenuItem>
                              ))}
                          </NavigationMenuList>
                      </NavigationMenu>
                    )}
                </div>
                {isAuthenticated && (
                  <div className="flex items-center gap-4">
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button 
                                  variant="ghost" 
                                  className="relative h-8 w-8 rounded-full"
                              >
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-sm font-medium text-white">
                                      {profileEmoji}
                                  </div>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                              <div className="flex items-center justify-start gap-2 p-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-sm font-medium text-white">
                                      {profileEmoji}
                                  </div>
                                  <div className="flex flex-col space-y-1">
                                      <p className="text-sm font-medium text-gray-200">
                                          {session.data?.user?.email}
                                      </p>
                                  </div>
                              </div>
                              {userMenuItems.map((item) => (
                                  <DropdownMenuItem
                                      key={item.title}
                                      onClick={item.onClick}
                                      className="cursor-pointer"
                                  >
                                      {item.title}
                                  </DropdownMenuItem>
                              ))}
                          </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
                )}
            </div>
        </header>
    )
}