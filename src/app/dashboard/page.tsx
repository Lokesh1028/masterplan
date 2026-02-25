"use client"
import { useEffect, useState } from 'react'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Package, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ totalImports: 0, totalExports: 0, productCount: 0, customerCount: 0 })
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadDashboard() }, [])
  async function loadDashboard() {
    const [txRes, profileRes, prodRes, custRes] = await Promise.all([
      fetch('/api/transactions').then(r => r.json()),
      fetch('/api/profile').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
      fetch('/api/customers').then(r => r.json()),
    ])
    const allTx = Array.isArray(txRes) ? txRes : []
    setTransactions(allTx.slice(0, 20))
    setProfile(profileRes)
    const totalImports = allTx.filter((t: any) => t.type === 'IMPORT').reduce((s: number, t: any) => s + t.amount, 0)
    const totalExports = allTx.filter((t: any) => t.type === 'EXPORT').reduce((s: number, t: any) => s + t.amount, 0)
    setStats({ totalImports, totalExports, productCount: Array.isArray(prodRes) ? prodRes.length : 0, customerCount: Array.isArray(custRes) ? custRes.length : 0 })
    const months: Record<string, { imports: number; exports: number }> = {}
    allTx.forEach((t: any) => {
      const m = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      if (!months[m]) months[m] = { imports: 0, exports: 0 }
      if (t.type === 'IMPORT') months[m].imports += t.amount; else months[m].exports += t.amount
    })
    setMonthlyData(Object.entries(months).map(([name, v]) => ({ name, ...v })).slice(-6))
    setLoading(false)
  }
  const profit = stats.totalExports - stats.totalImports
  const currency = profile?.currency || 'INR'
  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  const pieData = [{ name: 'Revenue', value: stats.totalExports, color: '#22c55e' }, { name: 'Expenses', value: stats.totalImports, color: '#ef4444' }].filter(d => d.value > 0)

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1><p className="text-gray-500 mt-1">Overview of your business</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Net Profit</p><p className={`text-2xl font-bold mt-1 ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>{formatCurrency(profit, currency)}</p></div><div className={`p-3 rounded-lg ${profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}><DollarSign className={profit >= 0 ? 'text-green-500' : 'text-red-500'} size={20}/></div></div></div>
        <div className="bg-white rounded-xl border p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold mt-1 text-green-700">{formatCurrency(stats.totalExports, currency)}</p></div><div className="p-3 rounded-lg bg-green-50"><TrendingUp className="text-green-500" size={20}/></div></div></div>
        <div className="bg-white rounded-xl border p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Expenses</p><p className="text-2xl font-bold mt-1 text-red-700">{formatCurrency(stats.totalImports, currency)}</p></div><div className="p-3 rounded-lg bg-red-50"><TrendingDown className="text-red-500" size={20}/></div></div></div>
        <div className="bg-white rounded-xl border p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Products / Customers</p><p className="text-2xl font-bold mt-1">{stats.productCount} / {stats.customerCount}</p></div><div className="p-3 rounded-lg bg-blue-50"><Package className="text-blue-600" size={20}/></div></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly Overview</h2>
          {monthlyData.length > 0 ? (<ResponsiveContainer width="100%" height={280}><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="name" fontSize={12}/><YAxis fontSize={12}/><Tooltip/><Bar dataKey="exports" fill="#22c55e" name="Revenue" radius={[4,4,0,0]}/><Bar dataKey="imports" fill="#ef4444" name="Expenses" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>) : <p className="text-gray-400 text-center py-16">No data yet. Start by adding products!</p>}
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Revenue vs Expenses</h2>
          {pieData.length > 0 ? (<ResponsiveContainer width="100%" height={280}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({name,percent}: any) => `${name} ${(percent*100).toFixed(0)}%`}>{pieData.map((e,i) => <Cell key={i} fill={e.color}/>)}</Pie><Tooltip formatter={(v: any) => formatCurrency(v, currency)}/></PieChart></ResponsiveContainer>) : <p className="text-gray-400 text-center py-16">No data yet</p>}
        </div>
      </div>
      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b"><h2 className="font-semibold text-gray-900">Recent Transactions</h2></div>
        <div className="divide-y">
          {transactions.length === 0 && <p className="text-gray-400 text-center py-8">No transactions yet</p>}
          {transactions.map((tx: any) => (
            <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
              <div className={`p-2 rounded-lg ${tx.type === 'IMPORT' ? 'bg-red-50' : 'bg-green-50'}`}>{tx.type === 'IMPORT' ? <ArrowDownCircle className="text-red-500" size={20}/> : <ArrowUpCircle className="text-green-500" size={20}/>}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p><p className="text-xs text-gray-500">{formatDateTime(tx.createdAt)}</p></div>
              <span className={`text-sm font-semibold ${tx.type === 'IMPORT' ? 'text-red-500' : 'text-green-500'}`}>{tx.type === 'IMPORT' ? '-' : '+'}{formatCurrency(tx.amount, currency)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
