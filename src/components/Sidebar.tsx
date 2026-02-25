"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, Package, Users, FileText, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
const links = [{href:"/dashboard",label:"Dashboard",icon:LayoutDashboard},{href:"/inventory",label:"Inventory",icon:Package},{href:"/customers",label:"Customers",icon:Users},{href:"/invoices",label:"Invoices",icon:FileText},{href:"/settings",label:"Settings",icon:Settings}]
export default function Sidebar() {
  const pathname = usePathname(); const [open, setOpen] = useState(false)
  return (<><button onClick={()=>setOpen(!open)} className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md">{open?<X size={20}/>:<Menu size={20}/>}</button><aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ${open?"translate-x-0":"-translate-x-full"} md:translate-x-0`}><div className="flex items-center gap-2 p-6 border-b"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">M</span></div><span className="font-bold text-lg">Masterplan</span></div><nav className="p-4 space-y-1">{links.map(({href,label,icon:Icon})=>{const a=pathname===href||pathname.startsWith(href+"/");return(<Link key={href} href={href} onClick={()=>setOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${a?"bg-blue-50 text-blue-700":"text-gray-600 hover:bg-gray-50"}`}><Icon size={18}/>{label}</Link>)})}</nav><div className="absolute bottom-0 left-0 right-0 p-4 border-t"><button onClick={()=>signOut({callbackUrl:"/login"})} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full"><LogOut size={18}/> Sign Out</button></div></aside></>)
}
