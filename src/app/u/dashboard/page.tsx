"use client"
import { useSession } from "next-auth/react"
 
export default function Dashboard() {
  const { data: session } = useSession()

  console.log("session", session)
 
  if (session?.user?.role === "admin") {
    return <p>You are an admin, welcome!</p>
  }
 
  return <p>You are not authorized to view this page!</p>
}