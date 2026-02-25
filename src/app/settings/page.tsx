"use client"
import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
export default function SettingsPage() {
  const [form, setForm] = useState({storeName:'',address:'',phone:'',taxRate:'0',currency:'INR'}); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false); const [loading, setLoading] = useState(true)
  useEffect(() => { loadProfile() }, [])
  async function loadProfile() { const d = await fetch('/api/profile').then(r=>r.json()); if(d) setForm({storeName:d.storeName||'',address:d.address||'',phone:d.phone||'',taxRate:String(d.taxRate||0),currency:d.currency||'INR'}); setLoading(false) }
  async function handleSubmit(e: React.FormEvent) { e.preventDefault(); setSaving(true); setSaved(false); await fetch('/api/profile',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,taxRate:parseFloat(form.taxRate)||0})}); setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),3000) }
  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Store Settings</h1><p className="text-gray-500 mt-1">Configure your store profile</p></div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 mb-2">Store Details</h2>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label><input type="text" value={form.storeName} onChange={e=>setForm({...form,storeName:e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="VR Frozen Factory"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><textarea value={form.address} onChange={e=>setForm({...form,address:e.target.value})} rows={2} className="w-full px-3 py-2 border rounded-lg outline-none resize-none"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none"/></div>
        <h2 className="font-semibold text-gray-900 pt-4">Invoice Defaults</h2>
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label><input type="number" step="0.01" min="0" max="100" value={form.taxRate} onChange={e=>setForm({...form,taxRate:e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label><select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none"><option value="INR">INR</option><option value="USD">USD</option><option value="EUR">EUR</option></select></div></div>
        <div className="flex items-center gap-3 pt-2"><button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={16}/> {saving?'Saving...':'Save Settings'}</button>{saved && <span className="text-green-600 text-sm font-medium">Saved!</span>}</div>
      </form>
    </div>
  )
}
