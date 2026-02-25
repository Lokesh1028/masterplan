"use client"
import { useEffect, useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Plus, FileText, Search, Eye } from 'lucide-react'
export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]); const [search, setSearch] = useState(''); const [loading, setLoading] = useState(true)
  useEffect(() => { load() }, [])
  async function load() { const d = await fetch('/api/invoices').then(r=>r.json()); setInvoices(Array.isArray(d)?d:[]); setLoading(false) }
  const filtered = invoices.filter((i:any) => i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || i.customer?.name?.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-gray-900">Invoices</h1><p className="text-gray-500 mt-1">{invoices.length} invoices</p></div><Link href="/invoices/new" className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-600"><Plus size={18}/> New Invoice (Export)</Link></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/><input type="text" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg outline-none"/></div>
      {loading ? <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div> : filtered.length===0 ? <div className="text-center py-16 bg-white rounded-xl border"><FileText className="mx-auto text-gray-300" size={48}/><p className="mt-4 text-gray-500">No invoices</p><Link href="/invoices/new" className="mt-2 inline-block text-green-600 font-medium hover:underline">Create first invoice</Link></div> : (
        <div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b bg-gray-50"><th className="text-left p-4 font-medium text-gray-600">Invoice #</th><th className="text-left p-4 font-medium text-gray-600">Customer</th><th className="text-left p-4 font-medium text-gray-600">Date</th><th className="text-right p-4 font-medium text-gray-600">Amount</th><th className="text-center p-4 font-medium text-gray-600">Status</th><th className="text-right p-4 font-medium text-gray-600">Actions</th></tr></thead><tbody className="divide-y">{filtered.map((inv:any)=>(<tr key={inv.id} className="hover:bg-gray-50"><td className="p-4 font-medium text-gray-900">{inv.invoiceNumber}</td><td className="p-4 text-gray-600">{inv.customer?.name||"\u2014"}</td><td className="p-4 text-gray-500">{formatDate(inv.createdAt)}</td><td className="p-4 text-right font-semibold text-green-600">{formatCurrency(inv.totalAmount)}</td><td className="p-4 text-center"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${inv.status==='COMPLETED'?'bg-green-50 text-green-700':inv.status==='CANCELLED'?'bg-red-50 text-red-700':'bg-yellow-50 text-yellow-700'}`}>{inv.status}</span></td><td className="p-4 text-right"><Link href={`/invoices/${inv.id}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"><Eye size={14}/> View</Link></td></tr>))}</tbody></table></div>
      )}
    </div>
  )
}
