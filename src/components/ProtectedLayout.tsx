"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Sidebar from "./Sidebar"
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession(); const router = useRouter()
  useEffect(()=>{if(status==="unauthenticated")router.replace("/login")},[status,router])
  if(status==="loading") return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  if(status==="unauthenticated") return null
  return <div className="min-h-screen bg-gray-50"><Sidebar/><main className="md:ml-64 p-4 md:p-8">{children}</main></div>
}
