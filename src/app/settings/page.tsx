"use client"
import { useEffect, useState, useRef } from 'react'
import { Save, Upload, X, Image as ImageIcon } from 'lucide-react'
export default function SettingsPage() {
  const [form, setForm] = useState({storeName:'',address:'',phone:'',taxRate:'0',currency:'INR',logoUrl:''})
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false); const [loading, setLoading] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadProfile() }, [])

  async function loadProfile() {
    const d = await fetch('/api/profile').then(r=>r.json())
    if(d) setForm({storeName:d.storeName||'',address:d.address||'',phone:d.phone||'',taxRate:String(d.taxRate||0),currency:d.currency||'INR',logoUrl:d.logoUrl||''})
    setLoading(false)
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if(!file) return
    if(file.size > 512 * 1024) { alert('Logo must be under 512KB'); return }
    if(!file.type.startsWith('image/')) { alert('Please upload an image file'); return }
    const reader = new FileReader()
    reader.onload = () => { setForm({...form, logoUrl: reader.result as string}) }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setSaved(false)
    await fetch('/api/profile',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,taxRate:parseFloat(form.taxRate)||0})})
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),3000)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Store Settings</h1><p className="text-gray-500 mt-1">Configure your store profile</p></div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 mb-2">Store Logo</h2>
        <div className="flex items-center gap-4">
          {form.logoUrl ? (
            <div className="relative group">
              <img src={form.logoUrl} alt="Store logo" className="w-20 h-20 rounded-lg object-contain border bg-gray-50"/>
              <button type="button" onClick={()=>setForm({...form,logoUrl:''})} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
              <ImageIcon size={24} className="text-gray-400"/>
            </div>
          )}
          <div>
            <button type="button" onClick={()=>fileRef.current?.click()} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Upload size={14}/> {form.logoUrl ? 'Change Logo' : 'Upload Logo'}
            </button>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 512KB. Shows on invoices.</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden"/>
        </div>

        <h2 className="font-semibold text-gray-900 pt-2">Store Details</h2>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label><input type="text" value={form.storeName} onChange={e=>setForm({...form,storeName:e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="VR Frozen Factory"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><textarea value={form.address} onChange={e=>setForm({...form,address:e.target.value})} rows={2} className="w-full px-3 py-2 border rounded-lg outline-none resize-none"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none"/></div>

        <h2 className="font-semibold text-gray-900 pt-4">Invoice Defaults</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label><input type="number" step="0.01" min="0" max="100" value={form.taxRate} onChange={e=>setForm({...form,taxRate:e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label><select value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none"><option value="INR">INR</option><option value="USD">USD</option><option value="EUR">EUR</option></select></div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"><Save size={16}/> {saving?'Saving...':'Save Settings'}</button>
          {saved && <span className="text-green-600 text-sm font-medium">✓ Saved!</span>}
        </div>
      </form>
    </div>
  )
}
