'use client'

import Link from "next/link"
import Image from "next/image"
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import logo from "@/assets/logo.svg"
import { useSession } from "next-auth/react"
import router from "next/router"

interface SubItem {
  title: string
  description: string
  href: string
}

interface NavigationItem {
  title: string
  type: "dropdown" | "link"
  href?: string
  items?: SubItem[]
}

interface ActionButton {
  title: string
  href: string
  variant: "ghost" | "default"
  className: string
}

const navigationItems: NavigationItem[] = [
//   {
//     title: "Resources",
//     type: "dropdown",
//     items: [
//       {
//         title: "Blog",
//         description: "Latest updates and insights",
//         href: "/blog"
//       },
//       {
//         title: "Documentation",
//         description: "Detailed guides and API references",
//         href: "/docs"
//       },
//       {
//         title: "Case Studies",
//         description: "Success stories from our customers",
//         href: "/case-studies"
//       }
//     ]
//   },
  {
    title: "Docs",
    type: "link",
    href: "/docs"
  },
  {
    title: "Pricing",
    type: "link",
    href: "/pricing"
  }
]

const actionButtons: ActionButton[] = [
  {
    title: "Log In",
    href: "/auth/login",
    variant: "ghost",
    className: "text-gray-200 hover:bg-gray-800/50 hover:text-white h-10"
  },
  {
    title: "Contact",
    href: "/contact",
    variant: "ghost",
    className: "text-gray-200 hover:bg-gray-800/50 hover:text-white h-10"
  },
  {
    title: "Sign Up",
    href: "/auth/signup",
    variant: "default",
    className: "bg-[#00E599] text-gray-900 hover:bg-[#00E599]/90 h-10 shadow-lg shadow-emerald-500/20"
  }
]

export default function LandingHeader() {

  return (
    <header className="border-b border-gray-800/40 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logo}
              alt="Rumros Logo"
              width={44}
              height={44}
              priority
              className="object-contain"
            />
            <span className="font-geist-sans text-2xl font-bold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
              Rumros
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.type === "dropdown" ? (
                    <>
                      <NavigationMenuTrigger className="h-10 text-sm font-medium text-gray-200 hover:text-white">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-6 w-[400px] bg-gray-950/95">
                          {item.items?.map((subItem) => (
                            <NavigationMenuLink key={subItem.title} asChild>
                              <Link
                                href={subItem.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-800/50 hover:text-white"
                              >
                                <div className="text-sm font-medium leading-none text-gray-200">{subItem.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                                  {subItem.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href!} legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-800/50 hover:text-white">
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          {actionButtons.map((button) => (
            <Button 
              key={button.title}
              variant={button.variant}
              className={button.className}
              asChild
            >
              <Link href={button.href}>{button.title}</Link>
            </Button>
          ))}
        </div>
      </div>
    </header>
  )
}

