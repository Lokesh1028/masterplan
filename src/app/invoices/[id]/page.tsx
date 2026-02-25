"use client"
import { useEffect, useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, Printer } from 'lucide-react'
export default function InvoiceDetailPage() {
  const { id } = useParams(); const router = useRouter()
  const [invoice, setInvoice] = useState<any>(null); const [profile, setProfile] = useState<any>(null); const [loading, setLoading] = useState(true)
  useEffect(() => { if(id) load() }, [id])
  async function load() { const [inv,prof] = await Promise.all([fetch(`/api/invoices?id=${id}`).then(r=>r.json()),fetch('/api/profile').then(r=>r.json())]); setInvoice(inv); setProfile(prof); setLoading(false) }

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  async function downloadPDF() {
    const jsPDF = (await import('jspdf')).default; const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF(); const cur = profile?.currency||'INR'; const pw = doc.internal.pageSize.getWidth()
    let storeY = 25

    // Logo
    if (profile?.logoUrl) {
      try {
        const img = await loadImage(profile.logoUrl)
        const maxH = 18; const maxW = 40
        const ratio = Math.min(maxW / img.width, maxH / img.height)
        const w = img.width * ratio; const h = img.height * ratio
        doc.addImage(profile.logoUrl, 'PNG', 14, 14, w, h)
        storeY = 14 + h + 4
      } catch(e) { /* skip logo if error */ }
    }

    doc.setFontSize(20); doc.setFont('helvetica','bold'); doc.text(profile?.storeName||'Store',14,storeY)
    doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(100)
    if(profile?.address) doc.text(profile.address,14,storeY+7); if(profile?.phone) doc.text('Phone: '+profile.phone,14,storeY+12)
    doc.setFontSize(28); doc.setFont('helvetica','bold'); doc.setTextColor(34,197,94); doc.text('INVOICE',pw-14,25,{align:'right'})
    doc.setTextColor(0); doc.setFontSize(10); doc.setFont('helvetica','normal'); doc.text('#'+invoice.invoiceNumber,pw-14,33,{align:'right'}); doc.text('Date: '+formatDate(invoice.createdAt),pw-14,39,{align:'right'})
    const lineY = Math.max(storeY+18, 48)
    doc.setDrawColor(229,231,235); doc.line(14,lineY,pw-14,lineY)
    doc.setFontSize(9); doc.setTextColor(100); doc.text('BILL TO',14,lineY+8)
    doc.setFontSize(11); doc.setTextColor(0); doc.setFont('helvetica','bold'); doc.text(invoice.customer?.name||'-',14,lineY+14)
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(100); let y=lineY+19
    if(invoice.customer?.address){doc.text(invoice.customer.address,14,y);y+=5}; if(invoice.customer?.phone){doc.text(invoice.customer.phone,14,y);y+=5}; if(invoice.customer?.email){doc.text(invoice.customer.email,14,y);y+=5}
    autoTable(doc,{startY:y+8,head:[['#','Product','Qty','Price','Subtotal']],body:invoice.items.map((item:any,i:number)=>[String(i+1),item.productName,String(item.qty),formatCurrency(item.priceAtSale,cur),formatCurrency(item.subtotal,cur)]),headStyles:{fillColor:[34,197,94],textColor:255,fontStyle:'bold'},styles:{fontSize:9,cellPadding:4},columnStyles:{0:{cellWidth:12},2:{halign:'center'},3:{halign:'right'},4:{halign:'right'}}})
    const fy=(doc as any).lastAutoTable.finalY+10; const sx=pw-80
    doc.setFontSize(9); doc.setTextColor(100); doc.text('Subtotal:',sx,fy); doc.text(formatCurrency(invoice.subtotal,cur),pw-14,fy,{align:'right'})
    doc.text('Tax ('+invoice.taxRate+'%):',sx,fy+6); doc.text(formatCurrency(invoice.taxAmount,cur),pw-14,fy+6,{align:'right'})
    let off=12; if(invoice.discountPercentage){doc.text('Discount ('+invoice.discountPercentage+'%):',sx,fy+off); doc.setTextColor(239,68,68); doc.text('-'+formatCurrency(invoice.discountAmount,cur),pw-14,fy+off,{align:'right'}); doc.setTextColor(100); off+=6}
    const ty=fy+off+2; doc.line(sx,ty-2,pw-14,ty-2); doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(34,197,94); doc.text('TOTAL:',sx,ty+4); doc.text(formatCurrency(invoice.totalAmount,cur),pw-14,ty+4,{align:'right'})
    if(invoice.notes){doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(100);doc.text('Notes: '+invoice.notes,14,ty+15)}
    doc.setFontSize(8);doc.setTextColor(150);doc.text('Thank you for your business! | Masterplan CRM',pw/2,doc.internal.pageSize.getHeight()-10,{align:'center'})
    doc.save(invoice.invoiceNumber+'.pdf')
  }
  if(loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  if(!invoice) return <div className="text-center py-16"><p className="text-gray-500">Not found</p></div>
  const cur = profile?.currency||'INR'
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between"><button onClick={()=>router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900"><ArrowLeft size={18}/> Back</button><div className="flex gap-2"><button onClick={()=>window.print()} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"><Printer size={16}/> Print</button><button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"><Download size={16}/> PDF</button></div></div>
      <div className="bg-white rounded-xl border p-8 print:border-0">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3">
              {profile?.logoUrl && <img src={profile.logoUrl} alt="Logo" className="w-14 h-14 object-contain rounded"/>}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile?.storeName||'Store'}</h1>
                <div className="text-sm text-gray-500 mt-1">{profile?.address&&<p>{profile.address}</p>}{profile?.phone&&<p>Phone: {profile.phone}</p>}</div>
              </div>
            </div>
          </div>
          <div className="text-right"><h2 className="text-3xl font-bold text-green-500">INVOICE</h2><p className="text-gray-600 font-medium mt-1">{invoice.invoiceNumber}</p><p className="text-sm text-gray-500">{formatDate(invoice.createdAt)}</p></div>
        </div>
        <hr className="mb-6"/>
        <div className="mb-6"><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bill To</p><p className="font-semibold text-gray-900">{invoice.customer?.name||'-'}</p>{invoice.customer?.address&&<p className="text-sm text-gray-500">{invoice.customer.address}</p>}{invoice.customer?.phone&&<p className="text-sm text-gray-500">{invoice.customer.phone}</p>}{invoice.customer?.email&&<p className="text-sm text-gray-500">{invoice.customer.email}</p>}</div>
        <table className="w-full text-sm mb-6"><thead><tr className="bg-green-500 text-white"><th className="text-left p-3 rounded-tl-lg">#</th><th className="text-left p-3">Product</th><th className="text-center p-3">Qty</th><th className="text-right p-3">Price</th><th className="text-right p-3 rounded-tr-lg">Subtotal</th></tr></thead><tbody className="divide-y">{invoice.items.map((item:any,i:number)=>(<tr key={item.id}><td className="p-3 text-gray-500">{i+1}</td><td className="p-3 font-medium">{item.productName}</td><td className="p-3 text-center">{item.qty}</td><td className="p-3 text-right">{formatCurrency(item.priceAtSale,cur)}</td><td className="p-3 text-right font-medium">{formatCurrency(item.subtotal,cur)}</td></tr>))}</tbody></table>
        <div className="flex justify-end"><div className="w-64 space-y-2 text-sm"><div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(invoice.subtotal,cur)}</span></div><div className="flex justify-between"><span className="text-gray-500">Tax ({invoice.taxRate}%)</span><span>{formatCurrency(invoice.taxAmount,cur)}</span></div>{invoice.discountPercentage>0&&<div className="flex justify-between"><span className="text-gray-500">Discount ({invoice.discountPercentage}%)</span><span className="text-red-500">-{formatCurrency(invoice.discountAmount,cur)}</span></div>}<hr/><div className="flex justify-between text-base font-bold"><span>Total</span><span className="text-green-600">{formatCurrency(invoice.totalAmount,cur)}</span></div></div></div>
        {invoice.notes&&<div className="mt-6 pt-4 border-t"><p className="text-xs text-gray-400 uppercase mb-1">Notes</p><p className="text-sm text-gray-600">{invoice.notes}</p></div>}
        <p className="text-center text-xs text-gray-400 mt-8">Thank you for your business!</p>
      </div>
    </div>
  )
}
