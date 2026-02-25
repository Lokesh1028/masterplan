"use client"
import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Search, Trash2, AlertCircle, Plus, X, UserPlus } from 'lucide-react'
export default function NewInvoicePage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([]); const [customers, setCustomers] = useState<any[]>([]); const [profile, setProfile] = useState<any>(null)
  const [selectedCustomer, setSelectedCustomer] = useState(''); const [custSearch, setCustSearch] = useState(''); const [prodSearch, setProdSearch] = useState('')
  const [showCustDD, setShowCustDD] = useState(false); const [showProdDD, setShowProdDD] = useState(false)
  const [items, setItems] = useState<any[]>([]); const [discount, setDiscount] = useState(0); const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false); const [error, setError] = useState('')
  // New customer inline form
  const [showNewCust, setShowNewCust] = useState(false)
  const [newCust, setNewCust] = useState({name:'',phone:'',email:'',address:''})
  const [savingCust, setSavingCust] = useState(false)

  useEffect(() => { loadData() }, [])
  async function loadData() { const [p,c,pr] = await Promise.all([fetch('/api/products').then(r=>r.json()),fetch('/api/customers').then(r=>r.json()),fetch('/api/profile').then(r=>r.json())]); setProducts(Array.isArray(p)?p:[]); setCustomers(Array.isArray(c)?c:[]); setProfile(pr) }

  async function createCustomer(e: React.FormEvent) {
    e.preventDefault()
    if(!newCust.name.trim()) { setError('Customer name is required'); return }
    setSavingCust(true); setError('')
    const res = await fetch('/api/customers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newCust)})
    const created = await res.json()
    if(!res.ok) { setError(created.error||'Failed to create customer'); setSavingCust(false); return }
    // Add to local list + select
    setCustomers(prev => [...prev, created])
    setSelectedCustomer(created.id)
    setNewCust({name:'',phone:'',email:'',address:''})
    setShowNewCust(false)
    setSavingCust(false)
  }

  function addItem(p:any) { if(items.find((i:any)=>i.productId===p.id)){setError(p.name+' already added');return}; if(p.stockQuantity<=0){setError(p.name+' out of stock');return}; setItems([...items,{productId:p.id,productName:p.name,qty:1,priceAtSale:p.sellingPrice,costAtSale:p.costPrice,subtotal:p.sellingPrice}]); setProdSearch(''); setShowProdDD(false); setError('') }
  function updateQty(i:number,q:number) { const p=products.find((x:any)=>x.id===items[i].productId); if(p&&q>p.stockQuantity){setError(`Only ${p.stockQuantity} available`);return}; setError(''); const u=[...items]; u[i].qty=q; u[i].subtotal=q*u[i].priceAtSale; setItems(u) }
  function updatePrice(i:number,pr:number) { const u=[...items]; u[i].priceAtSale=pr; u[i].subtotal=u[i].qty*pr; setItems(u) }
  const subtotal = items.reduce((s:number,i:any)=>s+i.subtotal,0)
  const taxRate = profile?.taxRate||0; const taxAmount = subtotal*(taxRate/100); const afterTax = subtotal+taxAmount; const discountAmount = afterTax*(discount/100); const total = afterTax-discountAmount

  async function handleSubmit() { if(!selectedCustomer){setError('Select a customer');return}; if(items.length===0){setError('Add items');return}; setSaving(true); setError(''); const res = await fetch('/api/invoices',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customerId:selectedCustomer,items,subtotal,taxRate,taxAmount,discountPercentage:discount,discountAmount,totalAmount:total,notes})}); const d=await res.json(); if(!res.ok){setError(d.error||'Failed');setSaving(false);return}; router.push(`/invoices/${d.id}`) }
  const fCust = customers.filter((c:any)=>c.name.toLowerCase().includes(custSearch.toLowerCase())); const fProd = products.filter((p:any)=>p.name.toLowerCase().includes(prodSearch.toLowerCase())&&!items.find((i:any)=>i.productId===p.id)); const selCustName = customers.find((c:any)=>c.id===selectedCustomer)?.name||''
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">New Invoice</h1></div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}

      <div className="bg-white rounded-xl border p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Customer</h2>
          <button type="button" onClick={()=>{setShowNewCust(!showNewCust);setError('')}} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
            {showNewCust ? <><X size={14}/> Cancel</> : <><UserPlus size={14}/> New Customer</>}
          </button>
        </div>

        {showNewCust ? (
          <form onSubmit={createCustomer} className="border rounded-lg p-4 bg-blue-50/50 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
              <input type="text" value={newCust.name} onChange={e=>setNewCust({...newCust,name:e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none bg-white" placeholder="Customer name" autoFocus/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="tel" value={newCust.phone} onChange={e=>setNewCust({...newCust,phone:e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none bg-white" placeholder="Phone number"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="email" value={newCust.email} onChange={e=>setNewCust({...newCust,email:e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none bg-white" placeholder="Email"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="text" value={newCust.address} onChange={e=>setNewCust({...newCust,address:e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none bg-white" placeholder="Address"/>
            </div>
            <button type="submit" disabled={savingCust} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              <Plus size={14}/> {savingCust ? 'Creating...' : 'Create & Select'}
            </button>
          </form>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
            <input type="text" value={selectedCustomer?selCustName:custSearch} onChange={e=>{setCustSearch(e.target.value);setSelectedCustomer('');setShowCustDD(true)}} onFocus={()=>setShowCustDD(true)} placeholder="Search customer..." className="w-full pl-9 pr-10 py-2 border rounded-lg outline-none"/>
            {selectedCustomer && <button type="button" onClick={()=>{setSelectedCustomer('');setCustSearch('')}} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={16}/></button>}
            {showCustDD&&fCust.length>0&&!selectedCustomer&&(<div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">{fCust.map((c:any)=>(<button key={c.id} onClick={()=>{setSelectedCustomer(c.id);setShowCustDD(false);setCustSearch('')}} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm"><span className="font-medium">{c.name}</span>{c.phone&&<span className="text-gray-400 ml-2">{c.phone}</span>}</button>))}</div>)}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border p-5"><h2 className="font-semibold text-gray-900 mb-3">Items</h2><div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/><input type="text" value={prodSearch} onChange={e=>{setProdSearch(e.target.value);setShowProdDD(true)}} onFocus={()=>setShowProdDD(true)} placeholder="Search product..." className="w-full pl-9 pr-4 py-2 border rounded-lg outline-none"/>{showProdDD&&prodSearch&&fProd.length>0&&(<div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">{fProd.map((p:any)=>(<button key={p.id} onClick={()=>addItem(p)} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm flex justify-between"><span><span className="font-medium">{p.name}</span><span className="text-gray-400 ml-2">Stock: {p.stockQuantity}</span></span><span className="text-green-600 font-medium">{formatCurrency(p.sellingPrice)}</span></button>))}</div>)}</div>
        {items.length>0?(<table className="w-full text-sm"><thead><tr className="border-b bg-gray-50"><th className="text-left p-3 font-medium text-gray-600">Product</th><th className="text-center p-3 font-medium text-gray-600 w-24">Qty</th><th className="text-right p-3 font-medium text-gray-600 w-32">Price</th><th className="text-right p-3 font-medium text-gray-600 w-32">Subtotal</th><th className="w-10"></th></tr></thead><tbody className="divide-y">{items.map((item:any,i:number)=>(<tr key={i}><td className="p-3 font-medium">{item.productName}</td><td className="p-3 text-center"><input type="number" min="1" value={item.qty} onChange={e=>updateQty(i,parseInt(e.target.value)||1)} className="w-20 text-center px-2 py-1 border rounded"/></td><td className="p-3 text-right"><input type="number" step="0.01" min="0" value={item.priceAtSale} onChange={e=>updatePrice(i,parseFloat(e.target.value)||0)} className="w-28 text-right px-2 py-1 border rounded"/></td><td className="p-3 text-right font-medium">{formatCurrency(item.subtotal)}</td><td className="p-3"><button onClick={()=>setItems(items.filter((_:any,idx:number)=>idx!==i))}><Trash2 size={14} className="text-gray-400 hover:text-red-500"/></button></td></tr>))}</tbody></table>):<p className="text-gray-400 text-center py-8">Search and add products above</p>}</div>
      {items.length>0&&(<div className="bg-white rounded-xl border p-5"><div className="max-w-xs ml-auto space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span></div><div className="flex justify-between"><span className="text-gray-500">Tax ({taxRate}%)</span><span className="font-medium">{formatCurrency(taxAmount)}</span></div><div className="flex justify-between items-center"><span className="text-gray-500">Discount</span><div className="flex items-center gap-1"><input type="number" min="0" max="100" value={discount} onChange={e=>setDiscount(parseFloat(e.target.value)||0)} className="w-16 text-right px-2 py-1 border rounded text-sm"/><span className="text-gray-400">%</span><span className="text-red-500 ml-2">-{formatCurrency(discountAmount)}</span></div></div><div className="flex justify-between pt-2 border-t text-base"><span className="font-semibold">Total</span><span className="font-bold text-green-600 text-lg">{formatCurrency(total)}</span></div></div></div>)}
      <div className="bg-white rounded-xl border p-5"><label className="block text-sm font-medium text-gray-700 mb-2">Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg outline-none resize-none" placeholder="Payment terms..."/></div>
      <div className="flex gap-3 justify-end"><button onClick={()=>router.back()} className="px-6 py-2.5 border rounded-lg font-medium text-gray-700 hover:bg-gray-50">Cancel</button><button onClick={handleSubmit} disabled={saving} className="px-6 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50">{saving?'Creating...':'Create Invoice'}</button></div>
    </div>
  )
}
